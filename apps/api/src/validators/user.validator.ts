/**
 * User Validators
 * Joi schemas for user endpoints
 */

import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Nome deve ter no mínimo 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
    }),
  lastName: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Sobrenome deve ter no mínimo 2 caracteres',
      'string.max': 'Sobrenome deve ter no máximo 100 caracteres',
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Telefone inválido (deve conter 10 ou 11 dígitos)',
    }),
  cpf: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .optional()
    .messages({
      'string.pattern.base': 'CPF inválido (deve conter 11 dígitos)',
    }),
  birthDate: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Data de nascimento inválida',
    }),
  avatar: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'URL do avatar inválida',
    }),
});

export const createAddressSchema = Joi.object({
  label: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Label deve ter no máximo 50 caracteres',
    }),
  street: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.max': 'Rua deve ter no máximo 255 caracteres',
      'any.required': 'Rua é obrigatória',
    }),
  number: Joi.string()
    .max(10)
    .required()
    .messages({
      'string.max': 'Número deve ter no máximo 10 caracteres',
      'any.required': 'Número é obrigatório',
    }),
  complement: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Complemento deve ter no máximo 100 caracteres',
    }),
  neighborhood: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Bairro deve ter no máximo 100 caracteres',
      'any.required': 'Bairro é obrigatório',
    }),
  city: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Cidade deve ter no máximo 100 caracteres',
      'any.required': 'Cidade é obrigatória',
    }),
  state: Joi.string()
    .length(2)
    .uppercase()
    .required()
    .messages({
      'string.length': 'Estado deve ter 2 caracteres',
      'any.required': 'Estado é obrigatório',
    }),
  zipCode: Joi.string()
    .pattern(/^[0-9]{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'CEP inválido (deve conter 8 dígitos)',
      'any.required': 'CEP é obrigatório',
    }),
  isDefault: Joi.boolean()
    .optional(),
});

export const updateAddressSchema = Joi.object({
  label: Joi.string()
    .max(50)
    .optional(),
  street: Joi.string()
    .max(255)
    .optional(),
  number: Joi.string()
    .max(10)
    .optional(),
  complement: Joi.string()
    .max(100)
    .optional(),
  neighborhood: Joi.string()
    .max(100)
    .optional(),
  city: Joi.string()
    .max(100)
    .optional(),
  state: Joi.string()
    .length(2)
    .uppercase()
    .optional(),
  zipCode: Joi.string()
    .pattern(/^[0-9]{8}$/)
    .optional(),
  isDefault: Joi.boolean()
    .optional(),
});

export const createUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Senha deve ter no mínimo 6 caracteres',
      'any.required': 'Senha é obrigatória',
    }),
  firstName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'any.required': 'Nome é obrigatório',
    }),
  lastName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'any.required': 'Sobrenome é obrigatório',
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .optional(),
  cpf: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .optional(),
  role: Joi.string()
    .valid('ADMIN', 'USER', 'GUEST')
    .default('USER')
    .optional(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .optional(),
  firstName: Joi.string()
    .min(2)
    .max(100)
    .optional(),
  lastName: Joi.string()
    .min(2)
    .max(100)
    .optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .optional(),
  cpf: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .optional(),
  role: Joi.string()
    .valid('ADMIN', 'USER', 'GUEST')
    .optional(),
  isActive: Joi.boolean()
    .optional(),
});
