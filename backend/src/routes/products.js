const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// Test endpoint to verify deployment
router.get('/test-deployment', async (req, res) => {
  return res.json({ 
    status: 'OK', 
    message: 'Server updated successfully',
    timestamp: new Date().toISOString(),
    version: 'v2.0-products-fix'
  });
});

// GET /api/v1/products - List all products (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, tag, sortBy = 'created_at', order = 'desc', price_min, price_max } = req.query;
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
    
    return response.success(res, { products, page: parseInt(page), limit: parseInt(limit), total: totalCount }, 'Products listed successfully (updated)');
  } catch (error) {
    console.error('List products error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Retornar array vazio em caso de erro ao invés de falhar
    return response.success(res, { products: [], page: parseInt(req.query.page || 1), limit: parseInt(req.query.limit || 10) }, 'Error occurred, returning empty products list');
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

    if (tableCheck.rows[0].orders_exist) {
      // If orders table exists, get best sellers based on actual sales
      console.log('📊 Getting best sellers based on order data');
      productsResult = await query(`
        SELECT p.*, c.name as category_name, 
               COALESCE(sales.total_sold, 0) as total_sold
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN (
          SELECT 
            json_extract_path_text(item.value, 'id') as product_id,
            SUM(json_extract_path_text(item.value, 'quantity')::integer) as total_sold
          FROM orders o,
          json_array_elements(o.items) as item
          GROUP BY json_extract_path_text(item.value, 'id')
        ) sales ON p.id::text = sales.product_id
        WHERE p.is_active = true
        ORDER BY COALESCE(sales.total_sold, 0) DESC, p.created_at DESC
        LIMIT $1
      `, [limit]);
    } else {
      // Fallback: get random products
      console.log('🎲 Orders table not found, getting random products');
      productsResult = await query(`
        SELECT p.*, c.name as category_name, 0 as total_sold
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true
        ORDER BY RANDOM()
        LIMIT $1
      `, [limit]);
    }

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
    const { title, description, price, original_price, sku, stock, category_id, tag, image_url } = req.body;

    if (!title || !price || !stock || !category_id) {
      return response.badRequest(res, 'Title, price, stock, and category are required');
    }

    const newProductResult = await query(
      'INSERT INTO products (title, description, price, original_price, sku, stock, category_id, tag, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, description, price, original_price, sku, stock, category_id, tag, image_url]
    );

    return response.created(res, { product: newProductResult.rows[0] }, 'Product created successfully');
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === '23505') { // unique_violation
        return response.badRequest(res, 'SKU already exists');
    }
    return response.error(res, 'Failed to create product');
  }
});

// PUT /api/v1/products/:id - Update a product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, original_price, sku, stock, category_id, tag, image_url, is_active } = req.body;

        if (!title || !price || !stock || !category_id) {
            return response.badRequest(res, 'Title, price, stock, and category are required');
        }

        const updatedProductResult = await query(
            `UPDATE products SET 
                title = $1, description = $2, price = $3, original_price = $4, sku = $5, 
                stock = $6, category_id = $7, tag = $8, image_url = $9, is_active = $10,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $11 RETURNING *`,
            [title, description, price, original_price, sku, stock, category_id, tag, image_url, is_active, id]
        );

        if (updatedProductResult.rows.length === 0) {
            return response.notFound(res, 'Product not found');
        }

        return response.success(res, { product: updatedProductResult.rows[0] }, 'Product updated successfully');
    } catch (error) {
        console.error('Update product error:', error);
        if (error.code === '23505') {
            return response.badRequest(res, 'SKU already exists');
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