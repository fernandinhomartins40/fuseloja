const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');
const response = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'fuseloja-super-secret-key-2024-production';

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return response.unauthorized(res, 'Access token required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user still exists and is active
    const result = await query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return response.unauthorized(res, 'User not found or inactive');
    }

    const user = result.rows[0];
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'TokenExpiredError') {
      return response.unauthorized(res, 'Token expired');
    }
    return response.unauthorized(res, 'Invalid token');
  }
};

// Middleware to check for admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return response.forbidden(res, 'Admin access required');
  }
  next();
};

// Middleware to check for user role (customer)
const requireUser = (req, res, next) => {
  if (!req.user || !['user', 'admin'].includes(req.user.role)) {
    return response.forbidden(res, 'User access required');
  }
  next();
};

// Middleware to ensure user can only access their own data
const requireOwnershipOrAdmin = (req, res, next) => {
  const resourceUserId = parseInt(req.params.id || req.params.userId);
  
  // Admin can access any resource
  if (req.user.role === 'admin') {
    return next();
  }
  
  // User can only access their own data
  if (req.user.id !== resourceUserId) {
    return response.forbidden(res, 'You can only access your own data');
  }
  
  next();
};

// Middleware to check specific roles
const requireRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return response.forbidden(res, `Access denied. Required roles: ${roles.join(', ')}`);
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireUser,
  requireOwnershipOrAdmin,
  requireRoles
};