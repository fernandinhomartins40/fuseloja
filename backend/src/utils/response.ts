import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types/index.js';

// Types for validation errors
export interface ValidationError {
  field: string;
  message: string;
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString()
    };
    
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Data retrieved successfully'
  ): Response {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const response: ApiResponse<PaginatedResponse<T>> = {
      success: true,
      message,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        }
      },
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return ResponseHelper.success(res, data, message, 201);
  }

  static updated<T>(
    res: Response,
    data: T,
    message: string = 'Resource updated successfully'
  ): Response {
    return ResponseHelper.success(res, data, message, 200);
  }

  static deleted(
    res: Response,
    message: string = 'Resource deleted successfully'
  ): Response {
    return ResponseHelper.success(res, null, message, 200);
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return ResponseHelper.error(res, message, 404);
  }

  static badRequest(
    res: Response,
    message: string = 'Bad Request',
    error?: string
  ): Response {
    return ResponseHelper.error(res, message, 400, error);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): Response {
    return ResponseHelper.error(res, message, 401);
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden'
  ): Response {
    return ResponseHelper.error(res, message, 403);
  }

  static conflict(
    res: Response,
    message: string = 'Conflict',
    error?: string
  ): Response {
    return ResponseHelper.error(res, message, 409, error);
  }

  static validationError(
    res: Response,
    errors: ValidationError[],
    message: string = 'Validation failed'
  ): Response {
    return ResponseHelper.error(res, message, 422, JSON.stringify(errors));
  }

  static tooManyRequests(
    res: Response,
    message: string = 'Too many requests'
  ): Response {
    return ResponseHelper.error(res, message, 429);
  }
}

export default ResponseHelper; 