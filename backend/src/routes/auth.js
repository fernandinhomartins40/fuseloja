const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');
const { validateEmail, validatePassword } = require('../utils/validation');
const response = require('../utils/response');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return response.badRequest(res, 'All fields are required');
    }

    if (!validateEmail(email)) {
      return response.badRequest(res, 'Invalid email format');
    }

    if (!validatePassword(password)) {
      return response.badRequest(res, 'Password must be at least 6 characters');
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return response.conflict(res, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, role, created_at',
      [email.toLowerCase(), hashedPassword, firstName, lastName]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return response.created(res, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isEmailVerified: false,
        createdAt: user.created_at,
        updatedAt: user.created_at
      },
      tokens: {
        accessToken: token,
        refreshToken: token // Simplified: using same token for both
      }
    }, 'User registered successfully');
  } catch (error) {
    console.error('Registration error:', error);
    return response.error(res, 'Registration failed');
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response.badRequest(res, 'Email and password are required');
    }

    // Find user
    const result = await query(
      'SELECT id, email, password, first_name, last_name, role, is_active FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return response.unauthorized(res, 'Invalid credentials');
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return response.unauthorized(res, 'Account is deactivated');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return response.unauthorized(res, 'Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return response.success(res, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      tokens: {
        accessToken: token,
        refreshToken: token // Simplified: using same token for both
      }
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return response.error(res, 'Login failed');
  }
});

// Validate token endpoint
router.post('/validate', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return response.badRequest(res, 'Token is required');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user info
    const result = await query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return response.unauthorized(res, 'User not found or inactive');
    }

    const user = result.rows[0];

    return response.success(res, {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }, 'Token is valid');
  } catch (error) {
    console.error('Token validation error:', error);
    return response.unauthorized(res, 'Invalid token');
  }
});

// Get current user profile endpoint (for /api/v1/auth/me)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return response.unauthorized(res, 'Access token required');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const result = await query(
      'SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return response.unauthorized(res, 'User not found or inactive');
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
    return response.unauthorized(res, 'Invalid token');
  }
});

module.exports = router;