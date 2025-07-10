import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import config from './config';

// Types for logging
export interface LogContext {
  [key: string]: unknown;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Ensure logs directory exists
const logsDir = path.dirname(config.logFile);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logLevel,
  format: logFormat,
  transports: [
    // Write to file
    new winston.transports.File({
      filename: config.logFile,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Write errors to separate file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ],
  exitOnError: false
});

// Add console transport for development
if (config.nodeEnv === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Helper functions for structured logging
export const logRequest = (req: AuthenticatedRequest, res: Response, responseTime: number) => {
  const logData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id || 'anonymous'
  };
  
  logger.info('HTTP Request', logData);
};

export const logError = (error: Error, context?: LogContext) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    context
  });
};

export const logAuth = (action: string, userId: string, details?: LogContext) => {
  logger.info('Authentication Event', {
    action,
    userId,
    details
  });
};

export const logDatabase = (query: string, duration: number, error?: Error) => {
  if (error) {
    logger.error('Database Error', {
      query,
      duration: `${duration}ms`,
      error: error.message
    });
  } else {
    logger.debug('Database Query', {
      query,
      duration: `${duration}ms`
    });
  }
};

export const logSecurity = (event: string, details: LogContext) => {
  logger.warn('Security Event', {
    event,
    details
  });
};

export const logPerformance = (operation: string, duration: number, metadata?: LogContext) => {
  logger.info('Performance Metric', {
    operation,
    duration: `${duration}ms`,
    metadata
  });
};

export default logger; 