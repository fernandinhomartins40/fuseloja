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

    // Verificar se a tabela users existe
    try {
      const tableCheck = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        console.log('⚠️ Users table does not exist during registration');
        return response.error(res, 'Database not properly configured');
      }
    } catch (dbError) {
      console.log('⚠️ Database check failed during registration:', dbError.message);
      return response.error(res, 'Database connection failed');
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
    console.log('🔐 Login attempt received:', { email: req.body.email, hasPassword: !!req.body.password });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return response.badRequest(res, 'Email and password are required');
    }

    // Verificar se a tabela users existe
    try {
      const tableCheck = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        console.log('⚠️ Users table does not exist');
        return response.error(res, 'Database not properly configured');
      }
    } catch (dbError) {
      console.log('⚠️ Database check failed:', dbError.message);
      return response.error(res, 'Database connection failed');
    }

    // Find user
    console.log('🔍 Searching for user:', email.toLowerCase());
    const result = await query(
      'SELECT id, email, password, first_name, last_name, role, is_active FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found:', email.toLowerCase());
      return response.unauthorized(res, 'Invalid credentials');
    }

    console.log('✅ User found:', { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role });

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
    console.error('💥 Login error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      email: req.body.email
    });
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

// Update current user profile endpoint (for /api/v1/auth/me)
router.put('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return response.unauthorized(res, 'Access token required');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { firstName, lastName, phone, birthDate } = req.body;
    
    const result = await query(
      'UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND is_active = true RETURNING id, email, first_name, last_name, role, created_at, updated_at',
      [firstName, lastName, decoded.userId]
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
        updatedAt: user.updated_at
      }
    }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return response.error(res, 'Failed to update profile');
  }
});

module.exports = router;