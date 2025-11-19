/**
 * Customer Routes
 * Customer management endpoints
 */

import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerQuerySchema,
} from '../validators/customer.validator';

const router = Router();
const customerController = new CustomerController();

// All customer routes require admin authentication
router.use(authenticateToken, requireAdmin);

router.get(
  '/',
  validate(customerQuerySchema, 'query'),
  customerController.getCustomers
);

router.get(
  '/:id',
  customerController.getCustomerById
);

router.get(
  '/phone/:phone',
  customerController.getCustomerByPhone
);

router.get(
  '/:id/orders',
  customerController.getCustomerWithOrders
);

router.get(
  '/:id/statistics',
  customerController.getCustomerStatistics
);

router.post(
  '/',
  validate(createCustomerSchema),
  customerController.createCustomer
);

router.put(
  '/:id',
  validate(updateCustomerSchema),
  customerController.updateCustomer
);

router.delete(
  '/:id',
  customerController.deleteCustomer
);

export default router;
