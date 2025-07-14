const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import all route files
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const ordersRoutes = require('./routes/orders');
const customersRoutes = require('./routes/customers');
const uploadRoutes = require('./routes/upload');

// Import database initialization
const { createTables } = require('./scripts/createTables');
const { seedData } = require('./scripts/seedData');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Security and middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdn.gpteng.co"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
              connectSrc: ["'self'", "https://fuseloja.com.br", "https://cdn.jsdelivr.net", "http://82.25.69.57:3001", "https://82.25.69.57:3001", "ws://82.25.69.57:3001", "wss://82.25.69.57:3001"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "data:", "https:"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'", "blob:"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
}));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://fuseloja.com.br',
    'http://fuseloja.com.br',
    'https://www.fuseloja.com.br',
    'http://www.fuseloja.com.br'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve frontend build
app.use(express.static(path.join(__dirname, '../public')));

// Static files - serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database initialization function
const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');
    
    // Create tables
    await createTables();
    console.log('✅ Database tables created/verified');
    
    // Seed initial data if needed
    try {
      await seedData();
      console.log('✅ Database seeded with initial data');
    } catch (seedError) {
      console.log('⚠️ Database seeding skipped (data may already exist):', seedError.message);
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('🔄 Server will continue without database (for testing/development)');
  }
};

// API Routes with /api/v1 prefix
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  const { query } = require('./database/connection');
  
  let dbStatus = 'disconnected';
  let tablesStatus = {};
  
  try {
    // Test basic connectivity
    await query('SELECT 1');
    dbStatus = 'connected';
    
    // Check if main tables exist
    const tables = ['users', 'products', 'categories', 'orders', 'customers'];
    for (const table of tables) {
      try {
        const result = await query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [table]);
        tablesStatus[table] = result.rows[0].exists ? 'exists' : 'missing';
      } catch (error) {
        tablesStatus[table] = 'error';
      }
    }
  } catch (error) {
    dbStatus = 'error: ' + error.message;
  }
  
  const health = {
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0-fuseloja',
    environment: process.env.NODE_ENV || 'development',
    platform: process.platform,
    node_version: process.version,
    pid: process.pid,
    database: dbStatus,
    tables: tablesStatus,
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      admin: '/api/v1/admin',
      orders: '/api/v1/orders',
      customers: '/api/v1/customers',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      health: '/health'
    }
  };
  
  const statusCode = dbStatus === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Serve React app for all other routes (SPA fallback)
app.get('*', (req, res) => {
  // Don't serve HTML for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  
  // Serve index.html for all SPA routes
  res.sendFile(path.join(__dirname, '../public', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server with database initialization
const startServer = async () => {
  try {
    // Initialize database first
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 FuseLoja Backend running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 API Base: http://localhost:${PORT}/api/v1`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️ Database: PostgreSQL`);
      
      if (process.env.NODE_ENV === 'production') {
        console.log(`🌍 Frontend: Served from /public`);
      } else {
        console.log(`🔧 Frontend Dev: Expected on port 5173`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;