/**
 * Order Validators
 * Joi schemas for order endpoints
 */

import Joi from 'joi';

export const createOrderSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .optional()
    .allow(null)
    .messages({
      'string.uuid': 'ID de usuário inválido',
    }),
  customerId: Joi.string()
    .uuid()
    .optional()
    .allow(null)
    .messages({
      'string.uuid': 'ID de cliente inválido',
    }),
  customerName: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.max': 'Nome do cliente deve ter no máximo 255 caracteres',
      'any.required': 'Nome do cliente é obrigatório',
    }),
  customerEmail: Joi.string()
    .email()
    .optional()
    .allow('', null)
    .messages({
      'string.email': 'Email inválido',
    }),
  customerPhone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
      'string.pattern.base': 'Telefone inválido (deve conter 10 ou 11 dígitos)',
      'any.required': 'Telefone do cliente é obrigatório',
    }),
  addressId: Joi.string()
    .uuid()
    .optional()
    .allow(null)
    .messages({
      'string.uuid': 'ID de endereço inválido',
    }),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .uuid()
          .required()
          .messages({
            'string.uuid': 'ID de produto inválido',
            'any.required': 'ID do produto é obrigatório',
          }),
        quantity: Joi.number()
          .integer()
          .positive()
          .required()
          .messages({
            'number.positive': 'Quantidade deve ser um valor positivo',
            'any.required': 'Quantidade é obrigatória',
          }),
        unitPrice: Joi.number()
          .positive()
          .required()
          .messages({
            'number.positive': 'Preço unitário deve ser um valor positivo',
            'any.required': 'Preço unitário é obrigatório',
          }),
        discount: Joi.number()
          .min(0)
          .default(0)
          .optional(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Pedido deve ter pelo menos 1 item',
      'any.required': 'Itens do pedido são obrigatórios',
    }),
  discount: Joi.number()
    .min(0)
    .default(0)
    .optional(),
  shipping: Joi.number()
    .min(0)
    .default(0)
    .optional(),
  paymentMethod: Joi.string()
    .valid('WHATSAPP', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH')
    .default('WHATSAPP')
    .optional(),
  shippingMethod: Joi.string()
    .valid('A_DEFINIR', 'SEDEX', 'PAC', 'MOTOBOY', 'RETIRADA')
    .default('A_DEFINIR')
    .optional(),
});

export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED')
    .optional(),
  paymentMethod: Joi.string()
    .valid('WHATSAPP', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH')
    .optional(),
  shippingMethod: Joi.string()
    .valid('A_DEFINIR', 'SEDEX', 'PAC', 'MOTOBOY', 'RETIRADA')
    .optional(),
  trackingCode: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  discount: Joi.number()
    .min(0)
    .optional(),
  shipping: Joi.number()
    .min(0)
    .optional(),
});

export const orderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string()
    .valid('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED')
    .optional(),
  userId: Joi.string().uuid().optional(),
  customerId: Joi.string().uuid().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  search: Joi.string().optional(),
});
