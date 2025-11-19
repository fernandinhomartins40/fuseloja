/**
 * Auth Service
 * Authentication and authorization business logic
 */

import { User } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { TokenService } from './token.service';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken } from '../utils/jwt';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/errors';

export class AuthService {
  private userRepository: UserRepository;
  private tokenService: TokenService;

  constructor() {
    this.userRepository = new UserRepository();
    this.tokenService = new TokenService();
  }

  /**
   * Register new user
   */
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    cpf?: string;
  }): Promise<{
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
  }> {
    // Check if email already exists
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictError('Email já está em uso');
    }

    // Check if CPF already exists
    if (data.cpf) {
      const existingCpf = await this.userRepository.findByCpf(data.cpf);
      if (existingCpf) {
        throw new ConflictError('CPF já está em uso');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      cpf: data.cpf,
      role: 'USER',
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await this.tokenService.createRefreshToken(
      user.id,
      user.email,
      user.role
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(data: {
    email: string;
    password: string;
  }): Promise<{
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
  }> {
    // Find user
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AuthenticationError('Credenciais inválidas');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('Usuário inativo');
    }

    // Check if user is deleted
    if (user.deletedAt) {
      throw new AuthenticationError('Usuário não encontrado');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Credenciais inválidas');
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await this.tokenService.createRefreshToken(
      user.id,
      user.email,
      user.role
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.tokenService.refreshAccessToken(refreshToken);
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Senha atual incorreta');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });

    // Revoke all refresh tokens (logout from all devices)
    await this.tokenService.revokeAllUserTokens(userId);
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findByIdWithRelations(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Verify email (placeholder for future implementation)
   */
  async verifyEmail(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });
  }
}
