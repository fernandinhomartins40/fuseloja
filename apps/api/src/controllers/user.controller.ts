/**
 * User Controller
 * User management endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { success, paginated } from '../utils/response';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get all users
   * GET /api/v1/users
   */
  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search, role, isActive } = req.query;

      const result = await this.userService.getUsers({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        role: role as string,
        isActive: isActive ? isActive === 'true' : undefined,
      });

      paginated(res, result.users, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by ID
   * GET /api/v1/users/:id
   */
  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      success(res, user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create user
   * POST /api/v1/users
   */
  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      success(res, user, 'Usuário criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user
   * PUT /api/v1/users/:id
   */
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.updateUser(id, req.body);
      success(res, user, 'Usuário atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user
   * DELETE /api/v1/users/:id
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      success(res, null, 'Usuário deletado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update profile
   * PUT /api/v1/users/profile
   */
  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const user = await this.userService.updateProfile(userId, req.body);
      success(res, user, 'Perfil atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user addresses
   * GET /api/v1/users/addresses
   */
  getAddresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const addresses = await this.userService.getUserAddresses(userId);
      success(res, addresses);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create user address
   * POST /api/v1/users/addresses
   */
  createAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const address = await this.userService.createAddress(userId, req.body);
      success(res, address, 'Endereço criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user address
   * PUT /api/v1/users/addresses/:addressId
   */
  updateAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { addressId } = req.params;
      const address = await this.userService.updateAddress(userId, addressId, req.body);
      success(res, address, 'Endereço atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user address
   * DELETE /api/v1/users/addresses/:addressId
   */
  deleteAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { addressId } = req.params;
      await this.userService.deleteAddress(userId, addressId);
      success(res, null, 'Endereço deletado com sucesso');
    } catch (error) {
      next(error);
    }
  };
}
