/**
 * Category Routes
 * Category management endpoints
 */

import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
} from '../validators/category.validator';

const router = Router();
const categoryController = new CategoryController();

// Public routes
router.get(
  '/',
  validate(categoryQuerySchema, 'query'),
  categoryController.getCategories
);

router.get(
  '/active',
  categoryController.getActiveCategories
);

router.get(
  '/with-count',
  categoryController.getCategoriesWithCount
);

router.get(
  '/slug/:slug',
  categoryController.getCategoryBySlug
);

router.get(
  '/:id',
  categoryController.getCategoryById
);

router.get(
  '/:id/products',
  categoryController.getCategoryWithProducts
);

// Admin routes
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  validate(createCategorySchema),
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  categoryController.deleteCategory
);

export default router;
