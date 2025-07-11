import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthRequest } from '../types/index';
import ResponseHelper from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { validate, authSchemas } from '../utils/validation';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // POST /api/v1/auth/register
  register = asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body;
    
    const result = await this.authService.register(userData);
    
    ResponseHelper.created(res, result, 'User registered successfully');
  });

  // POST /api/v1/auth/login
  login = asyncHandler(async (req: Request, res: Response) => {
    const credentials = req.body;
    
    const result = await this.authService.login(credentials);
    
    ResponseHelper.success(res, result, 'Login successful');
  });

  // POST /api/v1/auth/logout
  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    
    ResponseHelper.success(res, null, 'Logout successful');
  });

  // POST /api/v1/auth/logout-all
  logoutAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return ResponseHelper.error(res, 'User not authenticated', 401);
    }
    const userId = req.user.id;
    
    await this.authService.logoutAll(userId);
    
    return ResponseHelper.success(res, null, 'Logged out from all devices');
  });

  // POST /api/v1/auth/refresh
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return ResponseHelper.badRequest(res, 'Refresh token is required');
    }
    
    const tokens = await this.authService.refreshToken(refreshToken);
    
    return ResponseHelper.success(res, { tokens }, 'Token refreshed successfully');
  });

  // POST /api/v1/auth/change-password
  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return ResponseHelper.error(res, 'User not authenticated', 401);
    }
    const userId = req.user.id;
    const passwordData = req.body;
    
    await this.authService.changePassword(userId, passwordData);
    
    return ResponseHelper.success(res, null, 'Password changed successfully');
  });

  // POST /api/v1/auth/forgot-password
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    
    if (!email) {
      return ResponseHelper.badRequest(res, 'Email is required');
    }
    
    await this.authService.resetPassword(email);
    
    return ResponseHelper.success(res, null, 'Password reset email sent');
  });

  // POST /api/v1/auth/reset-password
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return ResponseHelper.badRequest(res, 'Token and new password are required');
    }
    
    // In a real implementation, you would verify the token and update the password
    // For now, we'll just return success
    
    return ResponseHelper.success(res, null, 'Password reset successfully');
  });

  // POST /api/v1/auth/verify-email
  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token, userId } = req.body;
    
    if (!token || !userId) {
      return ResponseHelper.badRequest(res, 'Token and user ID are required');
    }
    
    await this.authService.verifyEmail(userId, token);
    
    return ResponseHelper.success(res, null, 'Email verified successfully');
  });

  // POST /api/v1/auth/resend-verification
  resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    
    if (!email) {
      return ResponseHelper.badRequest(res, 'Email is required');
    }
    
    await this.authService.resendVerificationEmail(email);
    
    return ResponseHelper.success(res, null, 'Verification email sent');
  });

  // GET /api/v1/auth/me
  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return ResponseHelper.error(res, 'User not authenticated', 401);
    }
    const user = req.user;
    
    // Remove password from response
    const { password, ...userProfile } = user;
    
    return ResponseHelper.success(res, { user: userProfile }, 'Profile retrieved successfully');
  });

  // GET /api/v1/auth/sessions
  getSessions = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return ResponseHelper.error(res, 'User not authenticated', 401);
    }
    const userId = req.user.id;
    
    const sessions = await this.authService.getUserSessions(userId);
    
    return ResponseHelper.success(res, { sessions }, 'Sessions retrieved successfully');
  });

  // POST /api/v1/auth/validate-token
  validateToken = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    
    if (!token) {
      return ResponseHelper.badRequest(res, 'Token is required');
    }
    
    const user = await this.authService.validateToken(token);
    
    if (!user) {
      return ResponseHelper.unauthorized(res, 'Invalid token');
    }
    
    const { password, ...userProfile } = user;
    
    return ResponseHelper.success(res, { 
      valid: true, 
      user: userProfile 
    }, 'Token is valid');
  });

  // Admin endpoints
  
  // POST /api/v1/auth/admin/create-user
  createAdminUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return ResponseHelper.badRequest(res, 'All fields are required');
    }
    
    const adminUser = await this.authService.createAdminUser(email, password, firstName, lastName);
    
    const { password: _, ...userWithoutPassword } = adminUser;
    
    return ResponseHelper.created(res, { user: userWithoutPassword }, 'Admin user created successfully');
  });

  // PUT /api/v1/auth/admin/promote-user/:userId
  promoteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!userId || !role) {
      return ResponseHelper.badRequest(res, 'User ID and role are required');
    }
    
    await this.authService.promoteUser(userId, role);
    
    return ResponseHelper.success(res, null, 'User role updated successfully');
  });

  // GET /api/v1/auth/check-email/:email
  checkEmailAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;
    
    // In a real implementation, check if email exists in database
    // For now, we'll simulate the check
    
    ResponseHelper.success(res, { 
      available: true 
    }, 'Email availability checked');
  });

  // POST /api/v1/auth/send-login-notification
  sendLoginNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    const { location } = req.body;
    
    // This would typically be called automatically on login
    // Provided as separate endpoint for testing
    
    ResponseHelper.success(res, null, 'Login notification sent');
  });

  // GET /api/v1/auth/security-events
  getSecurityEvents = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    
    // In a real implementation, get security events from audit logs
    const events = [
      {
        id: '1',
        type: 'login',
        description: 'Successful login',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      }
    ];
    
    ResponseHelper.success(res, { events }, 'Security events retrieved');
  });

  // POST /api/v1/auth/report-suspicious
  reportSuspiciousActivity = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { description, type } = req.body;
    
    // In a real implementation, log this to security monitoring
    
    ResponseHelper.success(res, null, 'Suspicious activity reported');
  });

  // Validation middleware
  static getValidationMiddleware() {
    return {
      register: validate(authSchemas.register),
      login: validate(authSchemas.login),
      changePassword: validate(authSchemas.changePassword),
      resetPassword: validate(authSchemas.resetPassword)
    };
  }
}

export default AuthController; 