const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

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
  origin: [
    'https://www.fuseloja.com.br',
    'https://fuseloja.com.br', 
    'http://www.fuseloja.com.br',
    'http://fuseloja.com.br',
    'http://localhost:5173', 
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
    version: '1.0.0-fuseloja',
    environment: process.env.NODE_ENV || 'development',
    platform: process.platform,
    node_version: process.version,
    pid: process.pid,
    database: 'connected',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      admin: '/api/v1/admin',
      health: '/health'
    }
  };
  
  res.status(200).json(health);
});

// Readiness probe for Kubernetes/Docker
app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

// Public routes (no authentication required)
app.use('/api/v1/auth', authRoutes);

// Protected routes (authentication required)
app.use('/api/v1/users', authenticateToken, userRoutes);
app.use('/api/v1/admin', adminRoutes); // Admin routes have their own authentication middleware

// API route (for checking if backend is working)
app.get('/api', (req, res) => {
  res.json({
    message: 'FuseLoja Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      admin: '/api/v1/admin'
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
          <title>FuseLoja - Sistema de Gestão</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              text-align: center; 
              padding: 50px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container { 
              max-width: 500px; 
              background: rgba(255, 255, 255, 0.1);
              padding: 40px; 
              border-radius: 20px; 
              box-shadow: 0 8px 32px rgba(0,0,0,0.3);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            h1 { 
              font-size: 2.5em; 
              margin-bottom: 20px; 
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            p { 
              font-size: 1.2em; 
              margin-bottom: 30px; 
              opacity: 0.9;
            }
            .links { 
              display: flex; 
              justify-content: center; 
              gap: 20px; 
              flex-wrap: wrap;
            }
            .links a { 
              color: white; 
              text-decoration: none; 
              padding: 10px 20px; 
              background: rgba(255, 255, 255, 0.2); 
              border-radius: 10px; 
              transition: all 0.3s;
            }
            .links a:hover { 
              background: rgba(255, 255, 255, 0.3); 
              transform: translateY(-2px);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🏪 FuseLoja</h1>
            <p>Sistema de Gestão de Loja</p>
            <p>Frontend em configuração...</p>
            <div class="links">
              <a href="/api">📡 API</a>
              <a href="/health">💚 Health Check</a>
              <a href="/api/v1/auth">🔐 Auth</a>
            </div>
          </div>
        </body>
      </html>
    `);
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FuseLoja Backend running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 API Authentication: http://localhost:${PORT}/api/v1/auth`);
  console.log(`👥 User Management: http://localhost:${PORT}/api/v1/users`);
  console.log(`👑 Admin Panel: http://localhost:${PORT}/api/v1/admin`);
});

module.exports = app;