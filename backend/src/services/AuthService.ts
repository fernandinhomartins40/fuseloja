import { UserModel } from '../models/UserModel';
import { PasswordHelper, JWTHelper, TokenHelper } from '../utils/crypto';
import { User, AuthTokens, LoginRequest, RegisterRequest, ChangePasswordRequest, UserRole } from '@/types';
import { ConflictError, UnauthorizedError, NotFoundError, ValidationError } from '../middleware/errorHandler';
import { logAuth } from '../utils/logger';
import { EmailService } from './EmailService';

export class AuthService {
  private userModel: UserModel;
  private emailService: EmailService;
  private refreshTokens: Map<string, { userId: string; expiresAt: Date }> = new Map();

  constructor() {
    this.userModel = new UserModel();
    this.emailService = new EmailService();
    
    // Clean up expired refresh tokens every hour
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 60 * 60 * 1000);
  }

  async register(userData: RegisterRequest): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await PasswordHelper.hash(userData.password);

      // Create user
      const newUser = await this.userModel.create({
        ...userData,
        password: hashedPassword,
        role: UserRole.USER,
        isEmailVerified: false,
        isActive: true
      });

      // Generate tokens
      const tokens = JWTHelper.generateTokens(newUser);
      
      // Store refresh token
      this.storeRefreshToken(tokens.refreshToken, newUser.id);

      // Send verification email
      await this.sendVerificationEmail(newUser);

      // Log registration
      logAuth('USER_REGISTERED', newUser.id, {
        email: newUser.email,
        role: newUser.role
      });

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return { user: userWithoutPassword, tokens };
    } catch (error) {
      logAuth('REGISTRATION_FAILED', 'unknown', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    try {
      // Find user by email
      const user = await this.userModel.findByEmail(credentials.email);
      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedError('Account is inactive');
      }

      // Verify password
      const isValidPassword = await PasswordHelper.verify(credentials.password, user.password);
      if (!isValidPassword) {
        logAuth('LOGIN_FAILED', user.id, { reason: 'invalid_password' });
        throw new UnauthorizedError('Invalid credentials');
      }

      // Generate tokens
      const tokens = JWTHelper.generateTokens(user);
      
      // Store refresh token
      this.storeRefreshToken(tokens.refreshToken, user.id);

      // Update last login
      await this.userModel.updateLastLogin(user.id);

      // Log successful login
      logAuth('LOGIN_SUCCESS', user.id, {
        email: user.email,
        role: user.role
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, tokens };
    } catch (error) {
      if (!(error instanceof UnauthorizedError)) {
        logAuth('LOGIN_ERROR', 'unknown', { error: error instanceof Error ? error.message : 'Unknown error' });
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = JWTHelper.verifyRefreshToken(refreshToken);
      if (!payload) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Check if refresh token is stored
      const storedToken = this.refreshTokens.get(refreshToken);
      if (!storedToken || storedToken.userId !== payload.id) {
        throw new UnauthorizedError('Refresh token not found');
      }

      // Check if token expired
      if (new Date() > storedToken.expiresAt) {
        this.refreshTokens.delete(refreshToken);
        throw new UnauthorizedError('Refresh token expired');
      }

      // Get user
      const user = await this.userModel.findById(payload.id);
      if (!user || !user.isActive) {
        this.refreshTokens.delete(refreshToken);
        throw new UnauthorizedError('User not found or inactive');
      }

      // Generate new tokens
      const newTokens = JWTHelper.generateTokens(user);
      
      // Remove old refresh token and store new one
      this.refreshTokens.delete(refreshToken);
      this.storeRefreshToken(newTokens.refreshToken, user.id);

      // Log token refresh
      logAuth('TOKEN_REFRESHED', user.id, { email: user.email });

      return newTokens;
    } catch (error) {
      logAuth('TOKEN_REFRESH_FAILED', 'unknown', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      // Remove refresh token
      this.refreshTokens.delete(refreshToken);
      
      // In a production environment, you might also want to:
      // 1. Blacklist the access token
      // 2. Log the logout event
      
      logAuth('LOGOUT', 'unknown', { refreshToken: refreshToken.substring(0, 8) + '...' });
    } catch (error) {
      logAuth('LOGOUT_ERROR', 'unknown', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async logoutAll(userId: string): Promise<void> {
    try {
      // Remove all refresh tokens for the user
      for (const [token, data] of this.refreshTokens.entries()) {
        if (data.userId === userId) {
          this.refreshTokens.delete(token);
        }
      }

      logAuth('LOGOUT_ALL', userId);
    } catch (error) {
      logAuth('LOGOUT_ALL_ERROR', userId, { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async changePassword(userId: string, passwordData: ChangePasswordRequest): Promise<void> {
    try {
      // Get user
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Verify current password
      const isValidPassword = await PasswordHelper.verify(passwordData.currentPassword, user.password);
      if (!isValidPassword) {
        throw new UnauthorizedError('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await PasswordHelper.hash(passwordData.newPassword);

      // Update password
      await this.userModel.update(userId, { password: hashedPassword });

      // Logout from all devices (invalidate all refresh tokens)
      await this.logoutAll(userId);

      // Log password change
      logAuth('PASSWORD_CHANGED', userId, { email: user.email });
    } catch (error) {
      logAuth('PASSWORD_CHANGE_FAILED', userId, { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      // Find user
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not
        logAuth('PASSWORD_RESET_REQUESTED', 'unknown', { email, found: false });
        return;
      }

      // Generate reset token
      const resetToken = TokenHelper.generateResetToken();
      
      // In a real implementation, you would:
      // 1. Store the reset token in database with expiration
      // 2. Send reset email with token
      
      // For now, we'll just send a simulated email
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);

      logAuth('PASSWORD_RESET_REQUESTED', user.id, { email: user.email });
    } catch (error) {
      logAuth('PASSWORD_RESET_ERROR', 'unknown', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async verifyEmail(userId: string, token: string): Promise<void> {
    try {
      // In a real implementation, you would verify the token against database
      // For now, we'll just verify the email
      
      const success = await this.userModel.verifyEmail(userId);
      if (!success) {
        throw new NotFoundError('User not found');
      }

      logAuth('EMAIL_VERIFIED', userId);
    } catch (error) {
      logAuth('EMAIL_VERIFICATION_FAILED', userId, { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async sendVerificationEmail(user: User): Promise<void> {
    try {
      const verificationToken = TokenHelper.generateVerificationToken();
      
      // In a real implementation, store the token in database
      // For now, just send the email
      await this.emailService.sendVerificationEmail(user.email, verificationToken);

      logAuth('VERIFICATION_EMAIL_SENT', user.id, { email: user.email });
    } catch (error) {
      logAuth('VERIFICATION_EMAIL_FAILED', user.id, { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    try {
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.isEmailVerified) {
        throw new ValidationError('Email already verified');
      }

      await this.sendVerificationEmail(user);
    } catch (error) {
      logAuth('RESEND_VERIFICATION_FAILED', 'unknown', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = JWTHelper.verifyAccessToken(token);
      if (!payload) {
        return null;
      }

      const user = await this.userModel.findById(payload.id);
      if (!user || !user.isActive) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async getUserSessions(userId: string): Promise<Array<{ token: string; expiresAt: Date }>> {
    const sessions: Array<{ token: string; expiresAt: Date }> = [];
    
    for (const [token, data] of this.refreshTokens.entries()) {
      if (data.userId === userId) {
        sessions.push({
          token: token.substring(0, 8) + '...',
          expiresAt: data.expiresAt
        });
      }
    }

    return sessions;
  }

  private storeRefreshToken(token: string, userId: string): void {
    // Calculate expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    this.refreshTokens.set(token, { userId, expiresAt });
  }

  private cleanupExpiredTokens(): void {
    const now = new Date();
    for (const [token, data] of this.refreshTokens.entries()) {
      if (now > data.expiresAt) {
        this.refreshTokens.delete(token);
      }
    }
  }

  // Admin functions
  async createAdminUser(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    try {
      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        throw new ConflictError('Admin user already exists');
      }

      const hashedPassword = await PasswordHelper.hash(password);
      
      const adminUser = await this.userModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.ADMIN,
        isEmailVerified: true,
        isActive: true
      });

      logAuth('ADMIN_USER_CREATED', adminUser.id, { email, createdBy: 'system' });
      return adminUser;
    } catch (error) {
      logAuth('ADMIN_USER_CREATION_FAILED', 'unknown', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async promoteUser(userId: string, newRole: UserRole): Promise<void> {
    try {
      const success = await this.userModel.update(userId, { role: newRole });
      if (!success) {
        throw new NotFoundError('User not found');
      }

      logAuth('USER_ROLE_CHANGED', userId, { newRole });
    } catch (error) {
      logAuth('USER_ROLE_CHANGE_FAILED', userId, { newRole, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }
}

export default AuthService; 