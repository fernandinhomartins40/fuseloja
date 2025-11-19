require('dotenv').config();
const { Pool } = require('pg');

// Database configuration with production defaults
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fuseloja',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // increased timeout for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    console.log('⚠️  Continuing without database for testing...');
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

// Query function with better error handling
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
      query: text,
      params: params,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = { pool, query };