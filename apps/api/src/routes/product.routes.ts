/**
 * Product Routes
 * Product management endpoints
 */

import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../validators/product.validator';
import Joi from 'joi';

const router = Router();
const productController = new ProductController();

// Public routes (with optional auth)
router.get(
  '/',
  optionalAuth,
  validate(productQuerySchema, 'query'),
  productController.getProducts
);

router.get(
  '/featured',
  productController.getFeaturedProducts
);

router.get(
  '/slug/:slug',
  optionalAuth,
  productController.getProductBySlug
);

router.get(
  '/category/:categoryId',
  optionalAuth,
  productController.getProductsByCategory
);

router.get(
  '/:id',
  optionalAuth,
  productController.getProductById
);

// Admin routes
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  validate(createProductSchema),
  productController.createProduct
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  productController.deleteProduct
);

router.patch(
  '/:id/stock',
  authenticateToken,
  requireAdmin,
  validate(Joi.object({ quantity: Joi.number().integer().required() })),
  productController.updateStock
);

export default router;
