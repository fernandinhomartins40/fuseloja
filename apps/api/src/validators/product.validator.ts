/**
 * Product Validators
 * Joi schemas for product endpoints
 */

import Joi from 'joi';

export const createProductSchema = Joi.object({
  title: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.max': 'Título deve ter no máximo 255 caracteres',
      'any.required': 'Título é obrigatório',
    }),
  slug: Joi.string()
    .max(255)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Slug deve conter apenas letras minúsculas, números e hífens',
    }),
  shortDescription: Joi.string()
    .optional()
    .allow('', null),
  description: Joi.string()
    .optional()
    .allow('', null),
  price: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Preço deve ser um valor positivo',
      'any.required': 'Preço é obrigatório',
    }),
  originalPrice: Joi.number()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Preço original deve ser um valor positivo',
    }),
  costPrice: Joi.number()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Preço de custo deve ser um valor positivo',
    }),
  sku: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  barcode: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  stock: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Estoque não pode ser negativo',
    }),
  minStock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .allow(null)
    .default(0),
  maxStock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .allow(null),
  weight: Joi.number()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Peso deve ser um valor positivo',
    }),
  height: Joi.number()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Altura deve ser um valor positivo',
    }),
  width: Joi.number()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Largura deve ser um valor positivo',
    }),
  length: Joi.number()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Comprimento deve ser um valor positivo',
    }),
  categoryId: Joi.string()
    .uuid()
    .optional()
    .allow('', null)
    .messages({
      'string.uuid': 'ID de categoria inválido',
    }),
  tag: Joi.string()
    .valid('PROMOCAO', 'EXCLUSIVO', 'NOVO', 'NOVIDADE', 'ULTIMA_UNIDADE', 'PRE_VENDA', 'NO_TAG')
    .optional()
    .allow(null),
  isActive: Joi.boolean()
    .default(true),
  isFeatured: Joi.boolean()
    .default(false),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        alt: Joi.string().max(255).optional().allow('', null),
        isPrimary: Joi.boolean().default(false),
        sortOrder: Joi.number().integer().default(0),
      })
    )
    .optional(),
  specifications: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(100).required(),
        value: Joi.string().max(255).required(),
      })
    )
    .optional(),
  variants: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(100).required(),
        value: Joi.string().max(100).required(),
        priceAdjustment: Joi.number().optional().allow(null),
        stockAdjustment: Joi.number().integer().optional().allow(null),
        sku: Joi.string().max(100).optional().allow('', null),
      })
    )
    .optional(),
});

export const updateProductSchema = Joi.object({
  title: Joi.string()
    .max(255)
    .optional(),
  slug: Joi.string()
    .max(255)
    .pattern(/^[a-z0-9-]+$/)
    .optional(),
  shortDescription: Joi.string()
    .optional()
    .allow('', null),
  description: Joi.string()
    .optional()
    .allow('', null),
  price: Joi.number()
    .positive()
    .optional(),
  originalPrice: Joi.number()
    .positive()
    .optional()
    .allow(null),
  costPrice: Joi.number()
    .positive()
    .optional()
    .allow(null),
  sku: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  barcode: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  stock: Joi.number()
    .integer()
    .min(0)
    .optional(),
  minStock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .allow(null),
  maxStock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .allow(null),
  weight: Joi.number()
    .positive()
    .optional()
    .allow(null),
  height: Joi.number()
    .positive()
    .optional()
    .allow(null),
  width: Joi.number()
    .positive()
    .optional()
    .allow(null),
  length: Joi.number()
    .positive()
    .optional()
    .allow(null),
  categoryId: Joi.string()
    .uuid()
    .optional()
    .allow('', null),
  tag: Joi.string()
    .valid('PROMOCAO', 'EXCLUSIVO', 'NOVO', 'NOVIDADE', 'ULTIMA_UNIDADE', 'PRE_VENDA', 'NO_TAG')
    .optional()
    .allow(null),
  isActive: Joi.boolean()
    .optional(),
  isFeatured: Joi.boolean()
    .optional(),
  images: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().optional(),
        url: Joi.string().uri().required(),
        alt: Joi.string().max(255).optional().allow('', null),
        isPrimary: Joi.boolean().default(false),
        sortOrder: Joi.number().integer().default(0),
      })
    )
    .optional(),
  specifications: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().optional(),
        name: Joi.string().max(100).required(),
        value: Joi.string().max(255).required(),
      })
    )
    .optional(),
  variants: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().optional(),
        name: Joi.string().max(100).required(),
        value: Joi.string().max(100).required(),
        priceAdjustment: Joi.number().optional().allow(null),
        stockAdjustment: Joi.number().integer().optional().allow(null),
        sku: Joi.string().max(100).optional().allow('', null),
      })
    )
    .optional(),
});

export const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().optional(),
  categoryId: Joi.string().uuid().optional(),
  tag: Joi.string().valid('PROMOCAO', 'EXCLUSIVO', 'NOVO', 'NOVIDADE', 'ULTIMA_UNIDADE', 'PRE_VENDA', 'NO_TAG').optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
  sortBy: Joi.string().valid('title', 'price', 'createdAt', 'salesCount', 'viewCount').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
});
