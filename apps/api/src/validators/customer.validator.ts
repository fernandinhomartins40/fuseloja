/**
 * Customer Validators
 * Joi schemas for customer endpoints
 */

import Joi from 'joi';

export const createCustomerSchema = Joi.object({
  name: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.max': 'Nome deve ter no máximo 255 caracteres',
      'any.required': 'Nome é obrigatório',
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
      'string.pattern.base': 'Telefone inválido (deve conter 10 ou 11 dígitos)',
      'any.required': 'Telefone é obrigatório',
    }),
  email: Joi.string()
    .email()
    .optional()
    .allow('', null)
    .messages({
      'string.email': 'Email inválido',
    }),
  cpf: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'CPF inválido (deve conter 11 dígitos)',
    }),
  birthDate: Joi.date()
    .iso()
    .optional()
    .allow(null)
    .messages({
      'date.format': 'Data de nascimento inválida',
    }),
  notes: Joi.string()
    .optional()
    .allow('', null),
});

export const updateCustomerSchema = Joi.object({
  name: Joi.string()
    .max(255)
    .optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .optional(),
  email: Joi.string()
    .email()
    .optional()
    .allow('', null),
  cpf: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .optional()
    .allow('', null),
  birthDate: Joi.date()
    .iso()
    .optional()
    .allow(null),
  notes: Joi.string()
    .optional()
    .allow('', null),
});

export const customerQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().optional(),
});
