import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { authRateLimit, passwordResetRateLimit, registrationRateLimit, emailVerificationRateLimit } from '../middleware/rateLimit';

const router = Router();
const authController = new AuthController();
const validationMiddleware = AuthController.getValidationMiddleware();

// Public routes (no authentication required)
router.post('/register', 
  registrationRateLimit,
  validationMiddleware.register,
  authController.register
);

router.post('/login', 
  authRateLimit,
  validationMiddleware.login,
  authController.login
);

router.post('/logout', 
  authController.logout
);

router.post('/refresh', 
  authController.refreshToken
);

router.post('/forgot-password', 
  passwordResetRateLimit,
  validationMiddleware.resetPassword,
  authController.forgotPassword
);

router.post('/reset-password', 
  passwordResetRateLimit,
  authController.resetPassword
);

router.post('/verify-email', 
  emailVerificationRateLimit,
  authController.verifyEmail
);

router.post('/resend-verification', 
  emailVerificationRateLimit,
  authController.resendVerification
);

router.post('/validate-token', 
  authController.validateToken
);

router.get('/check-email/:email', 
  authController.checkEmailAvailability
);

// Protected routes (authentication required)
router.use(requireAuth);

router.get('/me', 
  authController.getProfile
);

router.get('/sessions', 
  authController.getSessions
);

router.post('/logout-all', 
  authController.logoutAll
);

router.post('/change-password', 
  validationMiddleware.changePassword,
  authController.changePassword
);

router.post('/send-login-notification', 
  authController.sendLoginNotification
);

router.get('/security-events', 
  authController.getSecurityEvents
);

router.post('/report-suspicious', 
  authController.reportSuspiciousActivity
);

// Admin routes (admin authentication required)
router.use('/admin', requireAdmin);

router.post('/admin/create-user', 
  authController.createAdminUser
);

router.put('/admin/promote-user/:userId', 
  authController.promoteUser
);

export default router; 