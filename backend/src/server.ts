import { App } from './app';
import config from './utils/config';
import logger from './utils/logger';

// Start the application
const app = new App();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  // Close HTTP server
  app.server.close(() => {
    logger.info('HTTP server closed');
    
    // Close WebSocket server
    app.io.close(() => {
      logger.info('WebSocket server closed');
      process.exit(0);
    });
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
app.listen();

logger.info('Backend server started successfully', {
  port: config.port,
  nodeEnv: config.nodeEnv,
  apiDocs: `http://localhost:${config.port}/api-docs`
});

export default app; 