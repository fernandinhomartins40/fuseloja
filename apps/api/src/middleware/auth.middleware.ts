/**
 * Authentication Middleware
 * JWT token verification and role-based access control
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AuthenticationError, AuthorizationError } from '../utils/errors';

/**
 * Verify JWT token and attach user to request
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError('Token não fornecido');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      throw new AuthenticationError('Token não fornecido');
    }

    const payload = verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require admin role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  try {
    if (!req.user) {
      throw new AuthenticationError('Usuário não autenticado');
    }

    if (req.user.role !== 'ADMIN') {
      throw new AuthorizationError('Acesso permitido apenas para administradores');
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require specific role
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Usuário não autenticado');
      }

      if (!roles.includes(req.user.role)) {
        throw new AuthorizationError(`Acesso permitido apenas para: ${roles.join(', ')}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Optional authentication (does not throw if no token)
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

      if (token) {
        const payload = verifyAccessToken(token);
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
}
