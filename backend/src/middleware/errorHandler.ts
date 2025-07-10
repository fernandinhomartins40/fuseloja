import { Request, Response, NextFunction } from 'express';
import { logError } from '../utils/logger';
import ResponseHelper from '../utils/response';
import config from '../utils/config';

// Extend Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export interface MulterError extends Error {
  code: string;
  field?: string;
  storageErrors?: unknown[];
}

export class AppErrorClass extends Error implements AppError {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = error;

  // Log the error
  logError(error, {
    url: req.url,
    method: req.method,
    params: req.params,
    query: req.query,
    body: req.body,
    user: (req as AuthenticatedRequest).user?.id || 'anonymous',
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    message = handleMulterError(error as MulterError);
  }

  // Don't expose internal errors in production
  if (config.nodeEnv === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
  }

  // Send error response
  ResponseHelper.error(res, message, statusCode, 
    config.nodeEnv === 'development' ? error.stack : undefined
  );
};

// Handle Multer file upload errors
const handleMulterError = (error: MulterError): string => {
  switch (error.code) {
    case 'LIMIT_FILE_SIZE':
      return 'File too large';
    case 'LIMIT_FILE_COUNT':
      return 'Too many files';
    case 'LIMIT_UNEXPECTED_FILE':
      return 'Unexpected file field';
    case 'LIMIT_FIELD_KEY':
      return 'Field name too long';
    case 'LIMIT_FIELD_VALUE':
      return 'Field value too long';
    case 'LIMIT_FIELD_COUNT':
      return 'Too many fields';
    case 'LIMIT_PART_COUNT':
      return 'Too many parts';
    default:
      return 'File upload error';
  }
};

// 404 Not Found handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const message = `Route ${req.method} ${req.url} not found`;
  ResponseHelper.notFound(res, message);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Create application error
export const createError = (message: string, statusCode: number = 500): AppErrorClass => {
  return new AppErrorClass(message, statusCode);
};

// Error types for common scenarios
export class ValidationError extends AppErrorClass {
  constructor(message: string = 'Validation failed') {
    super(message, 422);
  }
}

export class NotFoundError extends AppErrorClass {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppErrorClass {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppErrorClass {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppErrorClass {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

export class RateLimitError extends AppErrorClass {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
  }
}

// Database error handler
export interface DatabaseError extends Error {
  code: string;
  errno?: number;
  sqlMessage?: string;
}

export const handleDatabaseError = (error: DatabaseError): AppErrorClass => {
  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return new ConflictError('Resource already exists');
  } else if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return new ValidationError('Invalid reference');
  } else if (error.code === 'SQLITE_CONSTRAINT_NOTNULL') {
    return new ValidationError('Missing required field');
  } else {
    return new AppErrorClass('Database error', 500);
  }
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  createError,
  AppErrorClass,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  handleDatabaseError
}; 