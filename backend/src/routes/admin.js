const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/v1/admin/users - List all users
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    // Get users with pagination
    const result = await query(
      `SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const users = result.rows.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }));

    return response.success(res, {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Users retrieved successfully');

  } catch (error) {
    console.error('Get users error:', error);
    return response.error(res, 'Failed to retrieve users', 500);
  }
});

// GET /api/v1/admin/users/:id - Get specific user
router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const result = await query(
      'SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return response.notFound(res, 'User not found');
    }

    const user = result.rows[0];
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    return response.success(res, userData, 'User retrieved successfully');

  } catch (error) {
    console.error('Get user error:', error);
    return response.error(res, 'Failed to retrieve user', 500);
  }
});

// PUT /api/v1/admin/users/:id - Update user
router.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { firstName, lastName, role, isActive } = req.body;

    // Prevent admin from deactivating themselves
    if (req.user.id === userId && isActive === false) {
      return response.badRequest(res, 'You cannot deactivate your own account');
    }

    const result = await query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, role = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING id, email, first_name, last_name, role, is_active, created_at, updated_at`,
      [firstName, lastName, role, isActive, userId]
    );

    if (result.rows.length === 0) {
      return response.notFound(res, 'User not found');
    }

    const user = result.rows[0];
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    return response.success(res, userData, 'User updated successfully');

  } catch (error) {
    console.error('Update user error:', error);
    return response.error(res, 'Failed to update user', 500);
  }
});

// DELETE /api/v1/admin/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return response.badRequest(res, 'You cannot delete your own account');
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);

    if (result.rows.length === 0) {
      return response.notFound(res, 'User not found');
    }

    return response.success(res, { deletedId: userId }, 'User deleted successfully');

  } catch (error) {
    console.error('Delete user error:', error);
    return response.error(res, 'Failed to delete user', 500);
  }
});

// GET /api/v1/admin/dashboard - Admin dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // Get user statistics
    const userStats = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE is_active = true) as active_users,
        COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_30d
      FROM users
    `);

    const stats = userStats.rows[0];

    return response.success(res, {
      userStats: {
        totalUsers: parseInt(stats.total_users),
        activeUsers: parseInt(stats.active_users),
        adminUsers: parseInt(stats.admin_users),
        newUsers30d: parseInt(stats.new_users_30d)
      }
    }, 'Dashboard data retrieved successfully');

  } catch (error) {
    console.error('Dashboard error:', error);
    return response.error(res, 'Failed to retrieve dashboard data', 500);
  }
});

module.exports = router;