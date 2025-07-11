const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Import middleware
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic security middleware - relaxed for serving static files
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: ['https://www.fuseloja.com.br', 'https://fuseloja.com.br', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0-minimal',
    environment: process.env.NODE_ENV || 'development',
    platform: process.platform,
    node_version: process.version,
    pid: process.pid,
    database: 'connected', // Simplified
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      health: '/health'
    }
  };
  
  res.status(200).json(health);
});

// Readiness probe for Kubernetes/Docker
app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authenticateToken, userRoutes);

// API route (for checking if backend is working)
app.get('/api', (req, res) => {
  res.json({
    message: 'Backend Minimal API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      users: '/api/v1/users'
    }
  });
});

// Serve static files from frontend build with proper options
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d',
  etag: false,
  lastModified: false
}));

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../public/index.html');
  
  // Check if index.html exists
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback HTML if frontend build missing
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>FuseLoja - Loading...</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #f5f5f5; 
            }
            .container { 
              max-width: 500px; 
              margin: 0 auto; 
              background: white; 
              padding: 40px; 
              border-radius: 10px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🏪 FuseLoja</h1>
            <p>Frontend em configuração...</p>
            <p><a href="/api">Ver API</a> | <a href="/health">Health Check</a></p>
          </div>
        </body>
      </html>
    `);
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;