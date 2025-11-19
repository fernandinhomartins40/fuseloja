/**
 * Order Routes
 * Order management endpoints
 */

import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createOrderSchema,
  updateOrderSchema,
  orderQuerySchema,
} from '../validators/order.validator';
import Joi from 'joi';

const router = Router();
const orderController = new OrderController();

// Public/User routes
router.post(
  '/',
  optionalAuth,
  validate(createOrderSchema),
  orderController.createOrder
);

router.get(
  '/my-orders',
  authenticateToken,
  orderController.getUserOrders
);

// Admin routes
router.get(
  '/',
  authenticateToken,
  requireAdmin,
  validate(orderQuerySchema, 'query'),
  orderController.getOrders
);

router.get(
  '/statistics',
  authenticateToken,
  requireAdmin,
  orderController.getStatistics
);

router.get(
  '/number/:orderNumber',
  authenticateToken,
  requireAdmin,
  orderController.getOrderByNumber
);

router.get(
  '/customer/:customerId',
  authenticateToken,
  requireAdmin,
  orderController.getCustomerOrders
);

router.get(
  '/:id',
  authenticateToken,
  orderController.getOrderById
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  validate(updateOrderSchema),
  orderController.updateOrder
);

router.patch(
  '/:id/status',
  authenticateToken,
  requireAdmin,
  validate(Joi.object({
    status: Joi.string()
      .valid('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED')
      .required(),
  })),
  orderController.updateOrderStatus
);

router.post(
  '/:id/cancel',
  authenticateToken,
  requireAdmin,
  orderController.cancelOrder
);

export default router;
