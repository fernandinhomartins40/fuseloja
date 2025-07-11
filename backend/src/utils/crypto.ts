import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config';
import { User, JWTPayload, AuthTokens } from '../types/index.js';

// Password hashing utilities
export class PasswordHelper {
  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, config.bcryptRounds);
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static generate(length: number = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Fill the rest
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }
}

// JWT utilities
export class JWTHelper {
  static generateTokens(user: User): AuthTokens {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, config.jwtSecret as string, {
      expiresIn: config.jwtExpiresIn
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret as string, {
      expiresIn: config.jwtRefreshExpiresIn
    } as jwt.SignOptions);

    // Calculate expiration time in seconds
    const expiresIn = this.getExpirationTime(config.jwtExpiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn
    };
  }

  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.jwtSecret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.jwtRefreshSecret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  private static getExpirationTime(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // default 1 hour

    const [, value, unit] = match;
    if (!value) return 3600;
    const num = parseInt(value, 10);

    switch (unit) {
      case 's': return num;
      case 'm': return num * 60;
      case 'h': return num * 3600;
      case 'd': return num * 86400;
      default: return 3600;
    }
  }
}

// Encryption utilities
export class EncryptionHelper {
  private static algorithm = 'aes-256-gcm';
  private static keyLength = 32;

  static generateKey(): string {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }

  static encrypt(text: string, key?: string): { encrypted: string; key: string } {
    const encryptionKey = key || this.generateKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, encryptionKey);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted: iv.toString('hex') + ':' + encrypted,
      key: encryptionKey
    };
  }

  static decrypt(encryptedData: string, key: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const [ivHex, encrypted] = parts;
    if (!ivHex || !encrypted) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher(this.algorithm, key);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Token generation utilities
export class TokenHelper {
  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateApiKey(): string {
    const prefix = 'ak_';
    const key = crypto.randomBytes(32).toString('hex');
    return prefix + key;
  }

  static generateUUID(): string {
    return crypto.randomUUID();
  }

  static generateShortId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

// Hash utilities for non-password data
export class HashHelper {
  static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static md5(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  static hmac(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }
}

export default {
  PasswordHelper,
  JWTHelper,
  EncryptionHelper,
  TokenHelper,
  HashHelper
}; 