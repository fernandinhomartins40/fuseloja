/**
 * User Routes
 * User management endpoints
 */

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
} from '../validators/user.validator';

const router = Router();
const userController = new UserController();

// Admin routes
router.get(
  '/',
  authenticateToken,
  requireAdmin,
  userController.getUsers
);

router.get(
  '/:id',
  authenticateToken,
  requireAdmin,
  userController.getUserById
);

router.post(
  '/',
  authenticateToken,
  requireAdmin,
  validate(createUserSchema),
  userController.createUser
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  userController.deleteUser
);

// User profile routes
router.put(
  '/profile',
  authenticateToken,
  validate(updateProfileSchema),
  userController.updateProfile
);

// Address routes
router.get(
  '/addresses',
  authenticateToken,
  userController.getAddresses
);

router.post(
  '/addresses',
  authenticateToken,
  validate(createAddressSchema),
  userController.createAddress
);

router.put(
  '/addresses/:addressId',
  authenticateToken,
  validate(updateAddressSchema),
  userController.updateAddress
);

router.delete(
  '/addresses/:addressId',
  authenticateToken,
  userController.deleteAddress
);

export default router;
