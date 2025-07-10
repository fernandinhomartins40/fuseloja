import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import configurations and utilities
import config from './utils/config';
import logger, { logRequest } from './utils/logger';
import { DatabaseManager } from './models/database';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalRateLimit } from './middleware/rateLimit';

// Import routes
import authRoutes from './routes/auth';

// Import services for initialization
import { AuthService } from './services/AuthService';
import { EmailService } from './services/EmailService';
import { FileService } from './services/FileService';

export class App {
  public app: express.Application;
  public server: any;
  public io: SocketIOServer;
  private authService!: AuthService;
  private emailService!: EmailService;
  private fileService!: FileService;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.socketCorsOrigins,
        methods: ['GET', 'POST']
      }
    });

    this.initializeServices();
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeWebSocket();
    this.initializeErrorHandling();
  }

  private initializeServices(): void {
    try {
      this.authService = new AuthService();
      this.emailService = new EmailService();
      this.fileService = new FileService();
      
      logger.info('Services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize services', error);
      process.exit(1);
    }
  }

  private initializeDatabase(): void {
    try {
      DatabaseManager.getInstance();
      logger.info('Database connection established');
    } catch (error) {
      logger.error('Database connection failed', error);
      process.exit(1);
    }
  }

  private initializeMiddlewares(): void {
    // Trust proxy for accurate IP addresses
    this.app.set('trust proxy', 1);

    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
    }));

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', {
        stream: {
          write: (message) => logger.info(message.trim())
        }
      }));
    }

    // Custom request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        logRequest(req, res, duration);
      });
      
      next();
    });

    // Rate limiting
    this.app.use(generalRateLimit);
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // API routes
    this.app.use(`${config.apiPrefix}/auth`, authRoutes);

    // File serving
    this.app.use('/uploads', express.static(config.uploadPath, {
      maxAge: '1d',
      etag: true
    }));

    // API documentation redirect
    this.app.get('/', (req, res) => {
      res.redirect('/api-docs');
    });
  }

  private initializeSwagger(): void {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Reusable Backend API',
          version: '1.0.0',
          description: 'A comprehensive, reusable backend API built with Node.js, Express, and TypeScript',
          contact: {
            name: 'API Support',
            email: 'support@example.com'
          }
        },
        servers: [
          {
            url: `http://localhost:${config.port}${config.apiPrefix}`,
            description: 'Development server'
          }
        ],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            },
            ApiKeyAuth: {
              type: 'apiKey',
              in: 'header',
              name: 'X-API-Key'
            }
          }
        },
        security: [
          {
            BearerAuth: []
          }
        ]
      },
      apis: ['./src/routes/*.ts', './src/controllers/*.ts']
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Reusable Backend API Documentation'
    }));

    // Serve raw swagger spec
    this.app.get('/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private initializeWebSocket(): void {
    this.io.on('connection', (socket) => {
      logger.info('Client connected to WebSocket', { socketId: socket.id });

      socket.on('authenticate', async (token) => {
        try {
          const user = await this.authService.validateToken(token);
          if (user) {
            socket.data.user = user;
            socket.join(`user:${user.id}`);
            socket.emit('authenticated', { success: true });
            logger.info('Socket authenticated', { userId: user.id, socketId: socket.id });
          } else {
            socket.emit('authentication_error', { message: 'Invalid token' });
            socket.disconnect();
          }
        } catch (error) {
          socket.emit('authentication_error', { message: 'Authentication failed' });
          socket.disconnect();
        }
      });

      socket.on('disconnect', (reason) => {
        logger.info('Client disconnected from WebSocket', { 
          socketId: socket.id, 
          reason,
          userId: socket.data.user?.id 
        });
      });

      // Heartbeat for connection monitoring
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });

    logger.info('WebSocket server initialized');
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);

    // Graceful shutdown handlers
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
      process.exit(1);
    });

    // Uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  private gracefulShutdown(signal: string): void {
    logger.info(`Received ${signal}. Graceful shutdown initiated...`);

    // Close server
    this.server.close(() => {
      logger.info('HTTP server closed');

      // Close WebSocket server
      this.io.close(() => {
        logger.info('WebSocket server closed');

        // Close database connection
        DatabaseManager.getInstance().close();
        
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 30000);
  }

  public listen(): void {
    this.server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`, {
        environment: config.nodeEnv,
        apiPrefix: config.apiPrefix,
        docsUrl: `http://localhost:${config.port}/api-docs`
      });
    });
  }

  // Method to send notifications via WebSocket
  public sendNotification(userId: string, notification: any): void {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  // Method to broadcast to all connected clients
  public broadcast(event: string, data: any): void {
    this.io.emit(event, data);
  }

  // Get application instance (for testing)
  public getApp(): express.Application {
    return this.app;
  }
}

// Create and start the application
const app = new App();

// Only start listening if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen();
}

export default app; 