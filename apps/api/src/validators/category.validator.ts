/**
 * Category Validators
 * Joi schemas for category endpoints
 */

import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório',
    }),
  slug: Joi.string()
    .max(100)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Slug deve conter apenas letras minúsculas, números e hífens',
    }),
  description: Joi.string()
    .optional()
    .allow('', null),
  icon: Joi.string()
    .max(50)
    .default('Package')
    .optional(),
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .default('#6B7280')
    .optional()
    .messages({
      'string.pattern.base': 'Cor inválida (formato: #RRGGBB)',
    }),
  iconColor: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'Cor do ícone inválida (formato: #RRGGBB)',
    }),
  imageUrl: Joi.string()
    .uri()
    .optional()
    .allow('', null)
    .messages({
      'string.uri': 'URL da imagem inválida',
    }),
  isActive: Joi.boolean()
    .default(true),
  sortOrder: Joi.number()
    .integer()
    .default(0)
    .optional(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .max(100)
    .optional(),
  slug: Joi.string()
    .max(100)
    .pattern(/^[a-z0-9-]+$/)
    .optional(),
  description: Joi.string()
    .optional()
    .allow('', null),
  icon: Joi.string()
    .max(50)
    .optional(),
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  iconColor: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .allow('', null),
  imageUrl: Joi.string()
    .uri()
    .optional()
    .allow('', null),
  isActive: Joi.boolean()
    .optional(),
  sortOrder: Joi.number()
    .integer()
    .optional(),
});

export const categoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});
