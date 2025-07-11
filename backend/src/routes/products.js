const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// GET /api/v1/products - List all products (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, tag, sortBy = 'created_at', order = 'desc' } = req.query;
    const offset = (page - 1) * limit;

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
    
    whereClauses.push('p.is_active = true');

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderByString = `ORDER BY ${sortBy} ${order.toUpperCase()}`;
    const limitOffsetString = `LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParams.push(limit, offset);

    const productsResult = await query(
      `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereString} ${orderByString} ${limitOffsetString}`,
      queryParams
    );

    const products = productsResult.rows.map(p => ({
      id: p.id,
      title: p.title,
      shortDescription: p.short_description,
      price: parseFloat(p.price),
      originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
      imageUrl: p.image_url,
      category: p.category_name,
      tag: p.tag,
      stock: p.stock,
    }));
    
    return response.success(res, { products, page: parseInt(page), limit: parseInt(limit) }, 'Products listed successfully');
  } catch (error) {
    console.error('List products error:', error);
    return response.error(res, 'Failed to list products');
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