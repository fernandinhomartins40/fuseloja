import Joi from 'joi';
import { LoginRequest, RegisterRequest, UpdateUserRequest, ChangePasswordRequest } from '../types';

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  name: Joi.string().min(2).max(50).required(),
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc')
  }
};

// Auth validation schemas
export const authSchemas = {
  login: Joi.object<LoginRequest>({
    email: commonSchemas.email,
    password: Joi.string().required()
  }),

  register: Joi.object<RegisterRequest>({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: commonSchemas.name,
    lastName: commonSchemas.name
  }),

  resetPassword: Joi.object({
    email: commonSchemas.email
  }),

  changePassword: Joi.object<ChangePasswordRequest>({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password
  })
};

// User validation schemas
export const userSchemas = {
  update: Joi.object<UpdateUserRequest>({
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    email: commonSchemas.email.optional()
  }),

  updateRole: Joi.object({
    role: Joi.string().valid('admin', 'user', 'moderator', 'guest').required()
  })
};

// File validation schemas
export const fileSchemas = {
  upload: Joi.object({
    folder: Joi.string().optional(),
    isPublic: Joi.boolean().default(false)
  })
};

// Generic validation schemas
export const genericSchemas = {
  pagination: Joi.object({
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
    sortBy: commonSchemas.pagination.sortBy,
    sortOrder: commonSchemas.pagination.sortOrder
  }),

  search: Joi.object({
    query: Joi.string().min(1).max(100).required(),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit
  }),

  bulkDelete: Joi.object({
    ids: Joi.array().items(Joi.string().uuid()).min(1).required()
  })
};

// Validation middleware helper
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        timestamp: new Date().toISOString()
      });
    }

    req.validatedData = value;
    next();
  };
};

// Query validation helper
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(422).json({
        success: false,
        message: 'Query validation failed',
        errors: validationErrors,
        timestamp: new Date().toISOString()
      });
    }

    req.validatedQuery = value;
    next();
  };
};

// Params validation helper
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(422).json({
        success: false,
        message: 'Parameters validation failed',
        errors: validationErrors,
        timestamp: new Date().toISOString()
      });
    }

    req.validatedParams = value;
    next();
  };
};

// Utility functions for validation
export const isValidEmail = (email: string): boolean => {
  const emailSchema = Joi.string().email();
  const { error } = emailSchema.validate(email);
  return !error;
};

export const isValidPassword = (password: string): boolean => {
  const { error } = commonSchemas.password.validate(password);
  return !error;
};

export const isValidUUID = (id: string): boolean => {
  const { error } = commonSchemas.id.validate(id);
  return !error;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
}; 