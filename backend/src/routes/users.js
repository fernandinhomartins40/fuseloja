const express = require('express');
const { query } = require('../database/connection');
const { requireOwnershipOrAdmin } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// GET /api/v1/users/profile - Get current user's profile
router.get('/profile', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
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
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    }, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    return response.error(res, 'Failed to retrieve profile');
  }
});

// PUT /api/v1/users/profile - Update current user's profile
router.put('/profile', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return response.badRequest(res, 'First name and last name are required');
    }

    const result = await query(
      'UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, first_name, last_name, role, created_at, updated_at',
      [firstName, lastName, req.user.id]
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
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return response.error(res, 'Failed to update profile');
  }
});

// GET /api/v1/users/:id - Get specific user (only their own data or admin)
router.get('/:id', requireOwnershipOrAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const result = await query(
      'SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users WHERE id = $1',
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
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    }, 'User retrieved successfully');
  } catch (error) {
    console.error('Get user error:', error);
    return response.error(res, 'Failed to retrieve user');
  }
});

// PUT /api/v1/users/:id - Update specific user (only their own data or admin)
router.put('/:id', requireOwnershipOrAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return response.badRequest(res, 'First name and last name are required');
    }

    // Regular users can only update their own profile, not role
    let updateQuery = 'UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, first_name, last_name, role, created_at, updated_at';
    let updateParams = [firstName, lastName, userId];

    // If admin is updating someone else's profile, they can also update role
    if (req.user.role === 'admin' && req.user.id !== userId && req.body.role) {
      updateQuery = 'UPDATE users SET first_name = $1, last_name = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, first_name, last_name, role, created_at, updated_at';
      updateParams = [firstName, lastName, req.body.role, userId];
    }

    const result = await query(updateQuery, updateParams);

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
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    }, 'User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    return response.error(res, 'Failed to update user');
  }
});

module.exports = router;