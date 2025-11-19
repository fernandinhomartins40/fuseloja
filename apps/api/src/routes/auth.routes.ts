/**
 * Auth Routes
 * Authentication endpoints
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refresh
);

// Protected routes
router.post(
  '/logout',
  authenticateToken,
  authController.logout
);

router.post(
  '/logout-all',
  authenticateToken,
  authController.logoutAll
);

router.post(
  '/change-password',
  authenticateToken,
  validate(changePasswordSchema),
  authController.changePassword
);

router.get(
  '/me',
  authenticateToken,
  authController.getProfile
);

router.post(
  '/verify-email',
  authenticateToken,
  authController.verifyEmail
);

export default router;
