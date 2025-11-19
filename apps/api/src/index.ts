/**
 * Main Entry Point
 * Starts the application
 */

import { createApp } from './app';
import { startServer, setupSignalHandlers } from './server';
import { logger } from './utils/logger';

/**
 * Bootstrap application
 */
async function bootstrap(): Promise<void> {
  try {
    // Create Express app
    const app = await createApp();
    logger.info('Express application created');

    // Start HTTP server
    const server = await startServer(app);
    logger.info('HTTP server started');

    // Setup graceful shutdown handlers
    setupSignalHandlers(server);
    logger.info('Signal handlers configured');

  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
