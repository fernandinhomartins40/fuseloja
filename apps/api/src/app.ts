/**
 * Express Application Configuration
 * Main application setup with all middleware and routes
 */

import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import config from './config';
import { corsMiddleware } from './middleware/cors.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import routes from './routes';
import { logger } from './utils/logger';
import { ensureDir } from './utils/file';

/**
 * Create and configure Express application
 */
export async function createApp(): Promise<Application> {
  const app = express();

  // Trust proxy (for rate limiting behind reverse proxy)
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS
  app.use(corsMiddleware);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression
  app.use(compression());

  // Request logging
  app.use(loggerMiddleware);

  // Rate limiting
  app.use(generalLimiter);

  // Ensure upload directory exists
  try {
    const uploadDir = path.join(process.cwd(), 'uploads');
    await ensureDir(uploadDir);
    logger.info(`Upload directory ensured at: ${uploadDir}`);
  } catch (error) {
    logger.error('Failed to create upload directory:', error);
  }

  // Static files (uploads)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // API routes
  app.use('/api/v1', routes);

  // Root route
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'FuseLoja API',
      version: '1.0.0',
      documentation: '/api/v1/health',
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp;
