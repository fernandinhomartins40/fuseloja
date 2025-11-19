/**
 * Auth Validators
 * Joi schemas for authentication endpoints
 */

import Joi from 'joi';

export const registerSchema = Joi.object({
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
      'string.min': 'Nome deve ter no mínimo 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório',
    }),
  lastName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Sobrenome deve ter no mínimo 2 caracteres',
      'string.max': 'Sobrenome deve ter no máximo 100 caracteres',
      'any.required': 'Sobrenome é obrigatório',
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
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Senha é obrigatória',
    }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Senha atual é obrigatória',
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Nova senha deve ter no mínimo 6 caracteres',
      'any.required': 'Nova senha é obrigatória',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Senhas não coincidem',
      'any.required': 'Confirmação de senha é obrigatória',
    }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token é obrigatório',
    }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório',
    }),
});
