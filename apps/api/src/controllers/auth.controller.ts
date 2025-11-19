/**
 * Auth Controller
 * Authentication endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { success } from '../utils/response';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      success(res, result, 'Usuário registrado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      success(res, result, 'Login realizado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);
      success(res, null, 'Logout realizado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout from all devices
   * POST /api/v1/auth/logout-all
   */
  logoutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      await this.authService.logoutAll(userId);
      success(res, null, 'Logout realizado em todos os dispositivos');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      success(res, result, 'Token renovado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(userId, currentPassword, newPassword);
      success(res, null, 'Senha alterada com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const user = await this.authService.getProfile(userId);
      success(res, user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify email
   * POST /api/v1/auth/verify-email
   */
  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      await this.authService.verifyEmail(userId);
      success(res, null, 'Email verificado com sucesso');
    } catch (error) {
      next(error);
    }
  };
}
