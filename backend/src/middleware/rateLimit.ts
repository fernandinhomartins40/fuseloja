import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import config from '../utils/config';
import { logSecurity } from '../utils/logger';
import ResponseHelper from '../utils/response';

// Extend Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Store for custom rate limiting
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    blocked?: boolean;
  };
}

export class CustomRateLimit {
  private static store: RateLimitStore = {};

  // Clean up expired entries every 5 minutes
  static {
    setInterval(() => {
      const now = Date.now();
      Object.keys(CustomRateLimit.store).forEach(key => {
        const entry = CustomRateLimit.store[key];
        if (entry && entry.resetTime < now) {
          delete CustomRateLimit.store[key];
        }
      });
    }, 5 * 60 * 1000);
  }

  // Create custom rate limiter
  static create(options: {
    windowMs: number;
    max: number;
    keyGenerator?: (req: Request) => string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    onLimitReached?: (req: Request) => void;
  }) {
    const {
      windowMs,
      max,
      keyGenerator = (req) => req.ip || 'unknown',
      skipSuccessfulRequests = false,
      skipFailedRequests = false,
      onLimitReached
    } = options;

    return (req: Request, res: Response, next: NextFunction): void => {
      const key = keyGenerator(req);
      const now = Date.now();
      const resetTime = now + windowMs;

      // Get or create rate limit entry
      let entry = CustomRateLimit.store[key];
      if (!entry || now > entry.resetTime) {
        entry = {
          count: 0,
          resetTime,
          blocked: false
        };
        CustomRateLimit.store[key] = entry;
      }

      // Check if blocked
      if (entry.blocked && now < entry.resetTime) {
        logSecurity('RATE_LIMIT_BLOCKED_REQUEST', {
          key,
          ip: req.ip,
          endpoint: req.path,
          count: entry.count
        });
        ResponseHelper.tooManyRequests(res, 'Rate limit exceeded. Please try again later.');
        return;
      }

      // Increment counter
      entry.count++;

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': max.toString(),
        'X-RateLimit-Remaining': Math.max(0, max - entry.count).toString(),
        'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
      });

      // Check if limit exceeded
      if (entry.count > max) {
        entry.blocked = true;
        
        if (onLimitReached) {
          onLimitReached(req);
        }

        logSecurity('RATE_LIMIT_EXCEEDED', {
          key,
          ip: req.ip,
          endpoint: req.path,
          count: entry.count,
          limit: max
        });

        ResponseHelper.tooManyRequests(res, 'Rate limit exceeded. Please try again later.');
        return;
      }

      // Handle response to update counter based on result
      const originalSend = res.send;
      res.send = function(data) {
        const statusCode = res.statusCode;
        
        // Adjust counter based on success/failure settings
        if (skipSuccessfulRequests && statusCode < 400) {
          entry.count--;
        } else if (skipFailedRequests && statusCode >= 400) {
          entry.count--;
        }

        return originalSend.call(this, data);
      };

      next();
    };
  }

  // Get current rate limit status for a key
  static getStatus(key: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.store[key];
    if (!entry) return null;

    return {
      count: entry.count,
      remaining: Math.max(0, entry.count),
      resetTime: entry.resetTime
    };
  }

  // Reset rate limit for a specific key
  static reset(key: string): void {
    delete this.store[key];
  }

  // Block a specific key
  static block(key: string, durationMs: number = 60 * 60 * 1000): void {
    this.store[key] = {
      count: Infinity,
      resetTime: Date.now() + durationMs,
      blocked: true
    };
  }
}

// Pre-configured rate limiters
export const generalRateLimit = rateLimit({
  windowMs: config.rateLimitWindow * 60 * 1000, // Convert minutes to milliseconds
  max: config.rateLimitMax,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  handler: (req, res) => {
    logSecurity('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      endpoint: req.path,
      userAgent: req.get('User-Agent')
    });
    ResponseHelper.tooManyRequests(res, 'Too many requests from this IP, please try again later.');
  }
});

// Strict rate limit for authentication endpoints
export const authRateLimit = CustomRateLimit.create({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  keyGenerator: (req) => `auth:${req.ip}`,
  onLimitReached: (req) => {
    logSecurity('AUTH_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      endpoint: req.path,
      userAgent: req.get('User-Agent')
    });
  }
});

// Password reset rate limit
export const passwordResetRateLimit = CustomRateLimit.create({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  keyGenerator: (req) => `password-reset:${req.ip}`,
  onLimitReached: (req) => {
    logSecurity('PASSWORD_RESET_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      email: req.body?.email
    });
  }
});

// File upload rate limit
export const uploadRateLimit = CustomRateLimit.create({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  keyGenerator: (req) => `upload:${(req as AuthenticatedRequest).user?.id || req.ip}`,
  skipFailedRequests: true
});

// API rate limit for external integrations
export const apiRateLimit = CustomRateLimit.create({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  keyGenerator: (req) => (req.headers['x-api-key'] as string) || req.ip || 'unknown'
});

// Registration rate limit
export const registrationRateLimit = CustomRateLimit.create({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  keyGenerator: (req) => `registration:${req.ip}`
});

// Email verification rate limit
export const emailVerificationRateLimit = CustomRateLimit.create({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 verification emails per hour
  keyGenerator: (req) => `email-verification:${req.ip}`
});

// Search rate limit
export const searchRateLimit = CustomRateLimit.create({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  keyGenerator: (req) => `search:${(req as AuthenticatedRequest).user?.id || req.ip}`,
  skipFailedRequests: true
});

// Per-user rate limit middleware
export const createUserRateLimit = (maxRequests: number, windowMs: number) => {
  return CustomRateLimit.create({
    windowMs,
    max: maxRequests,
    keyGenerator: (req) => `user:${(req as AuthenticatedRequest).user?.id || req.ip}`
  });
};

// Progressive rate limiting - increases penalty for repeated violations
export class ProgressiveRateLimit {
  private static violations: { [key: string]: { count: number; lastViolation: number } } = {};

  static create(baseWindowMs: number, baseMax: number) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = req.ip || 'unknown';
      const now = Date.now();
      const violation = ProgressiveRateLimit.violations[key];

      let windowMs = baseWindowMs;
      let max = baseMax;

      // Increase penalties for repeat offenders
      if (violation && (now - violation.lastViolation) < 24 * 60 * 60 * 1000) { // Within 24 hours
        const multiplier = Math.min(violation.count, 5); // Cap at 5x penalty
        windowMs *= multiplier;
        max = Math.max(1, Math.floor(max / multiplier));
      }

      const rateLimiter = CustomRateLimit.create({
        windowMs,
        max,
        keyGenerator: () => `progressive:${key}`,
        onLimitReached: (req) => {
          // Record violation
          if (!ProgressiveRateLimit.violations[key]) {
            ProgressiveRateLimit.violations[key] = { count: 0, lastViolation: 0 };
          }
          ProgressiveRateLimit.violations[key].count++;
          ProgressiveRateLimit.violations[key].lastViolation = now;

          logSecurity('PROGRESSIVE_RATE_LIMIT_VIOLATION', {
            ip: key,
            violationCount: ProgressiveRateLimit.violations[key].count,
            windowMs,
            max
          });
        }
      });

      rateLimiter(req, res, next);
    };
  }
}

export default {
  generalRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  uploadRateLimit,
  apiRateLimit,
  registrationRateLimit,
  emailVerificationRateLimit,
  searchRateLimit,
  createUserRateLimit,
  CustomRateLimit,
  ProgressiveRateLimit
}; 