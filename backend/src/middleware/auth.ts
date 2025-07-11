import { Request, Response, NextFunction } from 'express';
import { AuthRequest, UserRole, JWTPayload } from '../types/index';
import { JWTHelper } from '../utils/crypto';
import { UserModel } from '../models/UserModel';
import ResponseHelper from '../utils/response';
import { logAuth, logSecurity } from '../utils/logger';

export class AuthMiddleware {
  private static userModel = new UserModel();

  // Authentication middleware - verify JWT token
  static async authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        ResponseHelper.unauthorized(res, 'Authentication token required');
        return;
      }

      const token = JWTHelper.extractTokenFromHeader(authHeader);
      if (!token) {
        ResponseHelper.unauthorized(res, 'Invalid token format');
        return;
      }

      const payload = JWTHelper.verifyAccessToken(token);
      if (!payload) {
        ResponseHelper.unauthorized(res, 'Invalid or expired token');
        return;
      }

      // Get user from database to ensure they still exist and are active
      const user = await AuthMiddleware.userModel.findById(payload.id);
      if (!user || !user.isActive) {
        logSecurity('INACTIVE_USER_ACCESS_ATTEMPT', {
          userId: payload.id,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
        ResponseHelper.unauthorized(res, 'User account is inactive');
        return;
      }

      // Attach user and token payload to request
      req.user = user;
      req.tokenPayload = payload;

      logAuth('TOKEN_VERIFIED', user.id, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path
      });

      next();
    } catch (error) {
      logSecurity('AUTH_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      ResponseHelper.unauthorized(res, 'Authentication failed');
    }
  }

  // Optional authentication - won't fail if no token provided
  static async optionalAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        next();
        return;
      }

      const token = JWTHelper.extractTokenFromHeader(authHeader);
      if (!token) {
        next();
        return;
      }

      const payload = JWTHelper.verifyAccessToken(token);
      if (!payload) {
        next();
        return;
      }

      const user = await AuthMiddleware.userModel.findById(payload.id);
      if (user && user.isActive) {
        req.user = user;
        req.tokenPayload = payload;
      }

      next();
    } catch (error) {
      // Silently continue without authentication
      next();
    }
  }

  // Authorization middleware - check user roles
  static authorize(...allowedRoles: UserRole[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        ResponseHelper.unauthorized(res, 'Authentication required');
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        logSecurity('UNAUTHORIZED_ACCESS_ATTEMPT', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          endpoint: req.path,
          ip: req.ip
        });
        ResponseHelper.forbidden(res, 'Insufficient permissions');
        return;
      }

      next();
    };
  }

  // Admin-only middleware
  static adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
    AuthMiddleware.authorize(UserRole.ADMIN)(req, res, next);
  }

  // Check if user can access their own resource or is admin
  static ownerOrAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
    if (!req.user) {
      ResponseHelper.unauthorized(res, 'Authentication required');
      return;
    }

    const resourceUserId = req.params.userId || req.params.id;
    const isOwner = req.user.id === resourceUserId;
    const isAdmin = req.user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      logSecurity('RESOURCE_ACCESS_DENIED', {
        userId: req.user.id,
        resourceUserId,
        endpoint: req.path,
        ip: req.ip
      });
      ResponseHelper.forbidden(res, 'Access denied');
      return;
    }

    next();
  }

  // Verify email requirement
  static requireEmailVerification(req: AuthRequest, res: Response, next: NextFunction): void {
    if (!req.user) {
      ResponseHelper.unauthorized(res, 'Authentication required');
      return;
    }

    if (!req.user.isEmailVerified) {
      ResponseHelper.forbidden(res, 'Email verification required');
      return;
    }

    next();
  }

  // API Key authentication (for external integrations)
  static async apiKeyAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      
      if (!apiKey) {
        ResponseHelper.unauthorized(res, 'API key required');
        return;
      }

      // Here you would validate the API key against your database
      // For now, we'll use a simple validation
      if (!apiKey.startsWith('ak_') || apiKey.length < 32) {
        ResponseHelper.unauthorized(res, 'Invalid API key format');
        return;
      }

      // In a real implementation, you'd look up the API key in the database
      // and attach the associated user/application to the request
      
      logAuth('API_KEY_ACCESS', 'system', {
        apiKey: apiKey.substring(0, 8) + '...',
        ip: req.ip,
        endpoint: req.path
      });

      next();
    } catch (error) {
      ResponseHelper.unauthorized(res, 'API key authentication failed');
    }
  }

  // Rate limiting per user
  static userRateLimit = new Map<string, { count: number; resetTime: number }>();

  static rateLimitPerUser(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        next();
        return;
      }

      const userId = req.user.id;
      const now = Date.now();
      const userLimit = AuthMiddleware.userRateLimit.get(userId);

      if (!userLimit || now > userLimit.resetTime) {
        // Reset or initialize counter
        AuthMiddleware.userRateLimit.set(userId, {
          count: 1,
          resetTime: now + windowMs
        });
        next();
        return;
      }

      if (userLimit.count >= maxRequests) {
        logSecurity('RATE_LIMIT_EXCEEDED', {
          userId,
          count: userLimit.count,
          limit: maxRequests,
          ip: req.ip
        });
        ResponseHelper.tooManyRequests(res, 'Rate limit exceeded');
        return;
      }

      userLimit.count++;
      next();
    };
  }
}

// Convenience functions for common auth patterns
export const requireAuth = AuthMiddleware.authenticate;
export const optionalAuth = AuthMiddleware.optionalAuth;
export const requireAdmin = [AuthMiddleware.authenticate, AuthMiddleware.adminOnly];
export const requireRole = (...roles: UserRole[]) => [
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(...roles)
];
export const requireOwnerOrAdmin = [AuthMiddleware.authenticate, AuthMiddleware.ownerOrAdmin];
export const requireVerifiedEmail = [
  AuthMiddleware.authenticate,
  AuthMiddleware.requireEmailVerification
];

export default AuthMiddleware; 