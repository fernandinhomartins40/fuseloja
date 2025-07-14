const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// GET /api/v1/products - List all products (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 1000, category, search, tag, sortBy = 'created_at', order = 'desc', price_min, price_max } = req.query;
    
    // Debug log
    console.log('🔍 Products API Debug:', {
      host: req.get('host'),
      limit: limit,
      query: req.query,
      ip: req.ip
    });
    const offset = (page - 1) * limit;

    // Verificar se as tabelas existem primeiro
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('⚠️ Products table does not exist, returning empty array');
      return response.success(res, { products: [], page: parseInt(page), limit: parseInt(limit) }, 'Products table not found');
    }

    let whereClauses = [];
    let queryParams = [];
    let paramIndex = 1;

    if (category) {
      whereClauses.push(`p.category_id = (SELECT id FROM categories WHERE name = $${paramIndex++})`);
      queryParams.push(category);
    }
    if (search) {
      whereClauses.push(`(p.title ILIKE $${paramIndex++} OR p.description ILIKE $${paramIndex++})`);
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (tag) {
      whereClauses.push(`p.tag = $${paramIndex++}`);
      queryParams.push(tag);
    }
    if (price_min) {
      whereClauses.push(`p.price >= $${paramIndex++}`);
      queryParams.push(parseFloat(price_min));
    }
    if (price_max) {
      whereClauses.push(`p.price <= $${paramIndex++}`);
      queryParams.push(parseFloat(price_max));
    }
    
    whereClauses.push('p.is_active = true');

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderByString = `ORDER BY p.${sortBy} ${order.toUpperCase()}`;
    const limitOffsetString = `LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    // First get total count
    const countParams = queryParams.slice(0, -2); // Remove limit and offset params
    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${whereString}`,
      countParams
    );
    const totalCount = parseInt(countResult.rows[0].total);

    // Then get the products
    const productsResult = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${whereString} 
       ${orderByString} 
       ${limitOffsetString}`,
      queryParams
    );

    const products = productsResult.rows.map(p => ({
      id: p.id.toString(),
      title: p.title,
      shortDescription: p.short_description,
      description: p.description,
      price: parseFloat(p.price),
      originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
      imageUrl: p.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      category: p.category_name || 'Sem categoria',
      tag: p.tag,
      stock: p.stock,
      sku: p.sku,
      createdAt: p.created_at,
      updatedAt: p.updated_at
    }));
    
    return response.success(res, { products, page: parseInt(page), limit: parseInt(limit), total: totalCount }, 'Products listed successfully');
  } catch (error) {
    console.error('List products error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Retornar erro apropriado ao invés de array vazio
    return response.error(res, 'Erro ao buscar produtos. Verifique a conexão com o banco de dados.');
  }
});

// GET /api/v1/products/best-sellers - Get best selling products (public)
router.get('/best-sellers', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    // Check if tables exist
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as products_exist,
      EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'orders'
      ) as orders_exist;
    `);
    
    if (!tableCheck.rows[0].products_exist) {
      console.log('⚠️ Products table does not exist, returning empty array');
      return response.success(res, { products: [] }, 'Products table not found');
    }

    let productsResult;

    // Simplified best sellers - use products with 'promocao' tag or highest price (popular items)
    console.log('📊 Getting best sellers - simplified approach');
    productsResult = await query(`
      SELECT p.*, c.name as category_name
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = true
      ORDER BY 
        CASE 
          WHEN p.tag = 'promocao' THEN 1
          WHEN p.tag = 'novo' THEN 2
          ELSE 3
        END,
        p.price DESC,
        p.created_at DESC
      LIMIT $1
    `, [limit]);

    const products = productsResult.rows.map(p => ({
      id: p.id,
      title: p.title,
      shortDescription: p.short_description,
      description: p.description,
      price: parseFloat(p.price),
      originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
      sku: p.sku,
      stock: p.stock,
      imageUrl: p.image_url,
      category: p.category_name,
      tag: p.tag,
      totalSold: parseInt(p.total_sold) || 0,
      createdAt: p.created_at,
    }));

    return response.success(res, { products }, 'Best selling products retrieved successfully');
  } catch (error) {
    console.error('Get best sellers error:', error);
    return response.error(res, 'Failed to retrieve best selling products');
  }
});

// GET /api/v1/products/:id - Get a single product (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productResult = await query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1 AND p.is_active = true', 
      [id]
    );

    if (productResult.rows.length === 0) {
      return response.notFound(res, 'Product not found');
    }

    const p = productResult.rows[0];
    const product = {
      id: p.id,
      title: p.title,
      shortDescription: p.short_description,
      description: p.description,
      price: parseFloat(p.price),
      originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
      sku: p.sku,
      stock: p.stock,
      imageUrl: p.image_url,
      category: p.category_name,
      tag: p.tag,
      createdAt: p.created_at,
    };

    return response.success(res, { product }, 'Product retrieved successfully');
  } catch (error) {
    console.error('Get product error:', error);
    return response.error(res, 'Failed to retrieve product');
  }
});

// POST /api/v1/products - Create a new product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('🔍 CREATE PRODUCT - Request body:', JSON.stringify(req.body, null, 2));
    console.log('🔍 CREATE PRODUCT - User:', req.user);
    
    const { title, short_description, description, price, original_price, sku, stock, category_id, tag, image_url } = req.body;

    console.log('🔍 CREATE PRODUCT - Extracted fields:', {
      title, short_description, description, price, original_price, sku, stock, category_id, tag, image_url
    });

    // Validação completa de campos obrigatórios
    const validationErrors = [];
    
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      validationErrors.push('Title é obrigatório e deve ser uma string válida');
    }
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      validationErrors.push('Price deve ser um número maior que zero');
    }
    
    if (stock === undefined || stock === null || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      validationErrors.push('Stock deve ser um número não negativo');
    }
    
    if (!category_id || isNaN(parseInt(category_id))) {
      validationErrors.push('Category_id é obrigatório e deve ser um número válido');
    }
    
    // Validar se a categoria existe
    if (category_id) {
      try {
        const categoryCheck = await query('SELECT id FROM categories WHERE id = $1', [category_id]);
        if (categoryCheck.rows.length === 0) {
          validationErrors.push('Categoria especificada não existe');
        }
      } catch (categoryError) {
        console.error('Erro ao verificar categoria:', categoryError);
        validationErrors.push('Erro ao validar categoria');
      }
    }
    
    // Validar SKU único se fornecido
    if (sku && sku.trim().length > 0) {
      try {
        const skuCheck = await query('SELECT id FROM products WHERE sku = $1', [sku.trim()]);
        if (skuCheck.rows.length > 0) {
          validationErrors.push('SKU já existe');
        }
      } catch (skuError) {
        console.error('Erro ao verificar SKU:', skuError);
        validationErrors.push('Erro ao validar SKU');
      }
    }
    
    // Validar preço original se em promoção
    if (original_price && (isNaN(parseFloat(original_price)) || parseFloat(original_price) <= parseFloat(price))) {
      validationErrors.push('Preço original deve ser maior que o preço atual');
    }

    if (validationErrors.length > 0) {
      console.log('❌ CREATE PRODUCT - Validation failed:', validationErrors);
      return response.badRequest(res, validationErrors.join('; '));
    }

    // Preparar dados para inserção
    const productData = {
      title: title.trim(),
      short_description: short_description ? short_description.trim() : null,
      description: description ? description.trim() : null,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : null,
      sku: sku ? sku.trim() : null,
      stock: parseInt(stock),
      category_id: parseInt(category_id),
      tag: tag ? tag.trim() : null,
      image_url: image_url ? image_url.trim() : null
    };

    console.log('🔍 CREATE PRODUCT - Final product data:', productData);

    const newProductResult = await query(
      `INSERT INTO products (title, short_description, description, price, original_price, sku, stock, category_id, tag, image_url, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [
        productData.title,
        productData.short_description,
        productData.description,
        productData.price,
        productData.original_price,
        productData.sku,
        productData.stock,
        productData.category_id,
        productData.tag,
        productData.image_url
      ]
    );

    const createdProduct = newProductResult.rows[0];
    console.log('✅ CREATE PRODUCT - Success:', createdProduct.id);

    return response.created(res, { product: createdProduct }, 'Product created successfully');
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === '23505') { // unique_violation
        return response.badRequest(res, 'SKU already exists');
    }
    if (error.code === '23503') { // foreign_key_violation
        return response.badRequest(res, 'Invalid category ID');
    }
    return response.error(res, 'Failed to create product');
  }
});

// PUT /api/v1/products/:id - Update a product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔍 UPDATE PRODUCT - ID:', id, 'Body:', JSON.stringify(req.body, null, 2));
        
        const { title, short_description, description, price, original_price, sku, stock, category_id, tag, image_url, is_active } = req.body;

        // Validação completa de campos obrigatórios
        const validationErrors = [];
        
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
          validationErrors.push('Title é obrigatório e deve ser uma string válida');
        }
        
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
          validationErrors.push('Price deve ser um número maior que zero');
        }
        
        if (stock === undefined || stock === null || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
          validationErrors.push('Stock deve ser um número não negativo');
        }
        
        if (!category_id || isNaN(parseInt(category_id))) {
          validationErrors.push('Category_id é obrigatório e deve ser um número válido');
        }
        
        // Validar se o produto existe
        const productCheck = await query('SELECT id FROM products WHERE id = $1', [id]);
        if (productCheck.rows.length === 0) {
          return response.notFound(res, 'Product not found');
        }
        
        // Validar se a categoria existe
        if (category_id) {
          try {
            const categoryCheck = await query('SELECT id FROM categories WHERE id = $1', [category_id]);
            if (categoryCheck.rows.length === 0) {
              validationErrors.push('Categoria especificada não existe');
            }
          } catch (categoryError) {
            console.error('Erro ao verificar categoria:', categoryError);
            validationErrors.push('Erro ao validar categoria');
          }
        }
        
        // Validar SKU único se fornecido (excluindo o produto atual)
        if (sku && sku.trim().length > 0) {
          try {
            const skuCheck = await query('SELECT id FROM products WHERE sku = $1 AND id != $2', [sku.trim(), id]);
            if (skuCheck.rows.length > 0) {
              validationErrors.push('SKU já existe');
            }
          } catch (skuError) {
            console.error('Erro ao verificar SKU:', skuError);
            validationErrors.push('Erro ao validar SKU');
          }
        }
        
        // Validar preço original se em promoção
        if (original_price && (isNaN(parseFloat(original_price)) || parseFloat(original_price) <= parseFloat(price))) {
          validationErrors.push('Preço original deve ser maior que o preço atual');
        }

        if (validationErrors.length > 0) {
          console.log('❌ UPDATE PRODUCT - Validation failed:', validationErrors);
          return response.badRequest(res, validationErrors.join('; '));
        }

        // Preparar dados para atualização
        const productData = {
          title: title.trim(),
          short_description: short_description ? short_description.trim() : null,
          description: description ? description.trim() : null,
          price: parseFloat(price),
          original_price: original_price ? parseFloat(original_price) : null,
          sku: sku ? sku.trim() : null,
          stock: parseInt(stock),
          category_id: parseInt(category_id),
          tag: tag ? tag.trim() : null,
          image_url: image_url ? image_url.trim() : null,
          is_active: is_active !== undefined ? Boolean(is_active) : true
        };

        console.log('🔍 UPDATE PRODUCT - Final product data:', productData);

        const updatedProductResult = await query(
            `UPDATE products SET 
                title = $1, short_description = $2, description = $3, price = $4, original_price = $5, sku = $6, 
                stock = $7, category_id = $8, tag = $9, image_url = $10, is_active = $11,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $12 RETURNING *`,
            [
              productData.title,
              productData.short_description,
              productData.description,
              productData.price,
              productData.original_price,
              productData.sku,
              productData.stock,
              productData.category_id,
              productData.tag,
              productData.image_url,
              productData.is_active,
              id
            ]
        );

        if (updatedProductResult.rows.length === 0) {
            return response.notFound(res, 'Product not found');
        }

        const updatedProduct = updatedProductResult.rows[0];
        console.log('✅ UPDATE PRODUCT - Success:', updatedProduct.id);

        return response.success(res, { product: updatedProduct }, 'Product updated successfully');
    } catch (error) {
        console.error('Update product error:', error);
        if (error.code === '23505') {
            return response.badRequest(res, 'SKU already exists');
        }
        if (error.code === '23503') {
            return response.badRequest(res, 'Invalid category ID');
        }
        return response.error(res, 'Failed to update product');
    }
});

// DELETE /api/v1/products/:id - Deactivate a product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // We perform a soft delete by setting is_active to false
        const deactivatedProductResult = await query(
            'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [id]
        );

        if (deactivatedProductResult.rows.length === 0) {
            return response.notFound(res, 'Product not found');
        }

        return response.success(res, null, 'Product deactivated successfully');
    } catch (error) {
        console.error('Deactivate product error:', error);
        return response.error(res, 'Failed to deactivate product');
    }
});


module.exports = router; 