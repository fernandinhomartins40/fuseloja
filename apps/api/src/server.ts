/**
 * HTTP Server
 * Creates and starts the HTTP server
 */

import http from 'http';
import { Application } from 'express';
import config from './config';
import { logger } from './utils/logger';
import prisma from './lib/prisma';

/**
 * Start HTTP server
 */
export async function startServer(app: Application): Promise<http.Server> {
  const server = http.createServer(app);

  // Test database connection
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
  }

  // Start listening
  return new Promise((resolve, reject) => {
    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`API URL: http://localhost:${config.port}/api/v1`);
      resolve(server);
    });

    server.on('error', (error) => {
      logger.error('Server error:', error);
      reject(error);
    });
  });
}

/**
 * Graceful shutdown
 */
export async function shutdown(server: http.Server): Promise<void> {
  logger.info('Shutting down server...');

  // Close server
  await new Promise<void>((resolve) => {
    server.close(() => {
      logger.info('Server closed');
      resolve();
    });
  });

  // Disconnect database
  await prisma.$disconnect();
  logger.info('Database disconnected');

  process.exit(0);
}

/**
 * Setup signal handlers
 */
export function setupSignalHandlers(server: http.Server): void {
  // Graceful shutdown on SIGTERM
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received');
    await shutdown(server);
  });

  // Graceful shutdown on SIGINT (Ctrl+C)
  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received');
    await shutdown(server);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    shutdown(server);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    shutdown(server);
  });
}
