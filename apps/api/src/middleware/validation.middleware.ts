/**
 * Validation Middleware
 * Joi schema validation for request data
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';

/**
 * Validate request body, query, or params using Joi schema
 */
export function validate(schema: Joi.ObjectSchema, target: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[target];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details: Record<string, string[]> = {};

      error.details.forEach((detail) => {
        const field = detail.path.join('.');
        if (!details[field]) {
          details[field] = [];
        }
        details[field].push(detail.message);
      });

      throw new ValidationError('Erro de validação', details);
    }

    // Replace request data with validated and sanitized value
    req[target] = value;

    next();
  };
}

/**
 * Validate multiple targets at once
 */
export function validateMultiple(schemas: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Record<string, Record<string, string[]>> = {};

    // Validate body
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.body = {};
        error.details.forEach((detail) => {
          const field = detail.path.join('.');
          if (!errors.body[field]) {
            errors.body[field] = [];
          }
          errors.body[field].push(detail.message);
        });
      } else {
        req.body = value;
      }
    }

    // Validate query
    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.query = {};
        error.details.forEach((detail) => {
          const field = detail.path.join('.');
          if (!errors.query[field]) {
            errors.query[field] = [];
          }
          errors.query[field].push(detail.message);
        });
      } else {
        req.query = value;
      }
    }

    // Validate params
    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.params = {};
        error.details.forEach((detail) => {
          const field = detail.path.join('.');
          if (!errors.params[field]) {
            errors.params[field] = [];
          }
          errors.params[field].push(detail.message);
        });
      } else {
        req.params = value;
      }
    }

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Erro de validação', errors);
    }

    next();
  };
}
