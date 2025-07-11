const express = require('express');
const { query } = require('../database/connection');
const { requireAdmin } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await query(
      'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return response.notFound(res, 'User not found');
    }

    const user = result.rows[0];
    return response.success(res, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isEmailVerified: false,
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at
      }
    }, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/me', async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const result = await query(
      'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING id, email, first_name, last_name, role',
      [firstName, lastName, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Admin routes
router.use(requireAdmin);

// Get all users (Admin only)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get users with pagination
    const result = await query(
      'SELECT id, email, first_name, last_name, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    const users = result.rows.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at
    }));

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Deactivate user (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await query(
      'UPDATE users SET is_active = false WHERE id = $1 RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

module.exports = router;