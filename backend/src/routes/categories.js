const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// GET /api/v1/categories - List all categories (public)
router.get('/', async (req, res) => {
    try {
        const categoriesResult = await query('SELECT * FROM categories ORDER BY name ASC');
        return response.success(res, { categories: categoriesResult.rows }, 'Categories listed successfully');
    } catch (error) {
        console.error('List categories error:', error);
        return response.error(res, 'Failed to list categories');
    }
});

// GET /api/v1/categories/:id - Get a single category (public)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const categoryResult = await query('SELECT * FROM categories WHERE id = $1', [id]);

        if (categoryResult.rows.length === 0) {
            return response.notFound(res, 'Category not found');
        }

        return response.success(res, { category: categoryResult.rows[0] }, 'Category retrieved successfully');
    } catch (error) {
        console.error('Get category error:', error);
        return response.error(res, 'Failed to retrieve category');
    }
});

// POST /api/v1/categories - Create a new category (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description, image_url, icon, color } = req.body;

        if (!name) {
            return response.badRequest(res, 'Category name is required');
        }

        const newCategoryResult = await query(
            'INSERT INTO categories (name, description, image_url, icon, color) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, image_url, icon, color]
        );

        return response.created(res, { category: newCategoryResult.rows[0] }, 'Category created successfully');
    } catch (error) {
        console.error('Create category error:', error);
        if (error.code === '23505') { // unique_violation
            return response.badRequest(res, 'Category name already exists');
        }
        return response.error(res, 'Failed to create category');
    }
});

// PUT /api/v1/categories/:id - Update a category (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image_url, icon, color } = req.body;

        if (!name) {
            return response.badRequest(res, 'Category name is required');
        }

        const updatedCategoryResult = await query(
            'UPDATE categories SET name = $1, description = $2, image_url = $3, icon = $4, color = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [name, description, image_url, icon, color, id]
        );

        if (updatedCategoryResult.rows.length === 0) {
            return response.notFound(res, 'Category not found');
        }

        return response.success(res, { category: updatedCategoryResult.rows[0] }, 'Category updated successfully');
    } catch (error) {
        console.error('Update category error:', error);
        if (error.code === '23505') {
            return response.badRequest(res, 'Category name already exists');
        }
        return response.error(res, 'Failed to update category');
    }
});

// DELETE /api/v1/categories/:id - Delete a category (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if any product is using this category
        const productsResult = await query('SELECT id FROM products WHERE category_id = $1 LIMIT 1', [id]);
        if (productsResult.rows.length > 0) {
            return response.badRequest(res, 'Cannot delete category with associated products');
        }

        const deletedCategoryResult = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

        if (deletedCategoryResult.rows.length === 0) {
            return response.notFound(res, 'Category not found');
        }

        return response.success(res, null, 'Category deleted successfully');
    } catch (error) {
        console.error('Delete category error:', error);
        return response.error(res, 'Failed to delete category');
    }
});

module.exports = router; 