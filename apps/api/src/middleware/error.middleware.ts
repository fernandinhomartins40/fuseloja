/**
 * Error Handling Middleware
 * Centralized error handler for Express
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import config from '../config';

/**
 * Global error handler
 */
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaError(error, res);
    return;
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Erro de validação dos dados',
        code: 'VALIDATION_ERROR',
      },
    });
    return;
  }

  // Handle application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        message: 'Token inválido',
        code: 'INVALID_TOKEN',
      },
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED',
      },
    });
    return;
  }

  // Handle Multer errors
  if (error.name === 'MulterError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Erro no upload de arquivo',
        code: 'UPLOAD_ERROR',
        details: { message: error.message },
      },
    });
    return;
  }

  // Default error response
  const statusCode = 500;
  const message = config.nodeEnv === 'production'
    ? 'Erro interno do servidor'
    : error.message;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: 'INTERNAL_SERVER_ERROR',
      ...(config.nodeEnv === 'development' && { stack: error.stack }),
    },
  });
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError, res: Response): void {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const target = error.meta?.target as string[] | undefined;
      const field = target ? target[0] : 'campo';
      res.status(409).json({
        success: false,
        error: {
          message: `${field} já está em uso`,
          code: 'DUPLICATE_ENTRY',
          details: error.meta,
        },
      });
      break;

    case 'P2025':
      // Record not found
      res.status(404).json({
        success: false,
        error: {
          message: 'Registro não encontrado',
          code: 'NOT_FOUND',
        },
      });
      break;

    case 'P2003':
      // Foreign key constraint violation
      res.status(400).json({
        success: false,
        error: {
          message: 'Referência inválida',
          code: 'FOREIGN_KEY_CONSTRAINT',
          details: error.meta,
        },
      });
      break;

    case 'P2014':
      // Required relation violation
      res.status(400).json({
        success: false,
        error: {
          message: 'Violação de relação obrigatória',
          code: 'RELATION_VIOLATION',
          details: error.meta,
        },
      });
      break;

    default:
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro no banco de dados',
          code: 'DATABASE_ERROR',
          details: config.nodeEnv === 'development' ? error.meta : undefined,
        },
      });
  }
}

/**
 * Not found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      message: `Rota ${req.path} não encontrada`,
      code: 'NOT_FOUND',
    },
  });
}
