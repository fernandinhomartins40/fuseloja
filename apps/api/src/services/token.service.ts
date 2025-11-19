/**
 * Token Service
 * Manages refresh tokens
 */

import prisma from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthenticationError } from '../utils/errors';
import config from '../config';

export class TokenService {
  /**
   * Create refresh token
   */
  async createRefreshToken(userId: string, email: string, role: string): Promise<string> {
    const token = generateRefreshToken({ userId, email, role });

    // Calculate expiry date
    const expiresAt = new Date();
    const days = parseInt(config.jwt.refreshTokenExpiry.replace('d', ''), 10);
    expiresAt.setDate(expiresAt.getDate() + days);

    // Save to database
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  /**
   * Verify and use refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Verify token
    const payload = verifyRefreshToken(refreshToken);

    // Check if token exists in database and is not revoked
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        revokedAt: null,
      },
    });

    if (!storedToken) {
      throw new AuthenticationError('Refresh token inválido ou revogado');
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      throw new AuthenticationError('Refresh token expirado');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    const newRefreshToken = await this.createRefreshToken(
      payload.userId,
      payload.email,
      payload.role
    );

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Revoke all user refresh tokens
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Clean expired tokens
   */
  async cleanExpiredTokens(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * Get user active tokens count
   */
  async getUserActiveTokensCount(userId: string): Promise<number> {
    return prisma.refreshToken.count({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }
}
