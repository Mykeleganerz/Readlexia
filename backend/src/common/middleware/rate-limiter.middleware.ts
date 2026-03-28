import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitInfo {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly requests = new Map<string, RateLimitInfo>();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly blockDurationMs: number;

  constructor(
    windowMs: number = 60000, // 1 minute
    maxRequests: number = 100, // 100 requests per minute
    blockDurationMs: number = 300000, // 5 minutes block
  ) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.blockDurationMs = blockDurationMs;

    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const identifier = this.getIdentifier(req);
    const now = Date.now();

    let info = this.requests.get(identifier);

    // Check if currently blocked
    if (info?.blocked && info.blockUntil && now < info.blockUntil) {
      const remainingTime = Math.ceil((info.blockUntil - now) / 1000);
      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: `Too many requests. Blocked for ${remainingTime} more seconds.`,
        error: 'Too Many Requests',
      });
    }

    // Reset if window expired or unblock if block period ended
    if (!info || now > info.resetTime || (info.blocked && now >= info.blockUntil!)) {
      info = {
        count: 0,
        resetTime: now + this.windowMs,
        blocked: false,
      };
      this.requests.set(identifier, info);
    }

    // Increment request count
    info.count++;

    // Check if limit exceeded
    if (info.count > this.maxRequests) {
      info.blocked = true;
      info.blockUntil = now + this.blockDurationMs;
      this.requests.set(identifier, info);

      const blockDurationSec = Math.ceil(this.blockDurationMs / 1000);
      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: `Rate limit exceeded. Blocked for ${blockDurationSec} seconds.`,
        error: 'Too Many Requests',
        retryAfter: blockDurationSec,
      });
    }

    // Set rate limit headers
    const remaining = Math.max(0, this.maxRequests - info.count);
    const resetTime = Math.ceil(info.resetTime / 1000);

    res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', resetTime.toString());

    next();
  }

  private getIdentifier(req: Request): string {
    // Use user ID if authenticated, otherwise use IP
    const userId = (req as any).user?.id;
    if (userId) {
      return `user:${userId}`;
    }

    // Get IP from various headers (for proxies)
    const ip =
      req.ip ||
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.socket.remoteAddress;

    return `ip:${ip}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, info] of this.requests.entries()) {
      // Remove expired entries
      if (now > info.resetTime && (!info.blocked || now >= info.blockUntil!)) {
        this.requests.delete(key);
      }
    }
  }
}

/**
 * Stricter rate limiter for authentication endpoints
 */
@Injectable()
export class AuthRateLimiterMiddleware extends RateLimiterMiddleware {
  constructor() {
    super(
      60000, // 1 minute window
      5, // Only 5 attempts per minute
      600000, // 10 minutes block
    );
  }
}

/**
 * More lenient rate limiter for read operations
 */
@Injectable()
export class ReadRateLimiterMiddleware extends RateLimiterMiddleware {
  constructor() {
    super(
      60000, // 1 minute window
      300, // 300 requests per minute
      60000, // 1 minute block
    );
  }
}

/**
 * Decorator to apply rate limiting to specific routes
 */
export function RateLimit(
  windowMs: number = 60000,
  maxRequests: number = 100,
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const limiter = new RateLimiterMiddleware(windowMs, maxRequests);

    descriptor.value = async function (...args: any[]) {
      const [req, res] = args;

      return new Promise((resolve, reject) => {
        limiter.use(req, res, (error?: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(originalMethod.apply(this, args));
          }
        });
      });
    };

    return descriptor;
  };
}
