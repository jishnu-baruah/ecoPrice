import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';

// Base rate limit configuration
const createRateLimiter = ({
  windowMs,
  max,
  message
}: {
  windowMs: number;
  max: number;
  message: string;
}) => {
  return rateLimit({
    windowMs,
    max,
    message: JSON.stringify({
      status: 429,
      code: 'RATE_LIMIT_EXCEEDED',
      message
    }),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

// Authentication rate limiter
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes'
});

// General API rate limiter
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.rateLimit.max || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

// Search endpoints rate limiter
export const searchLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // limit each IP to 50 requests per minute
  message: 'Too many search requests, please try again after 1 minute'
});

// User profile rate limiter
export const profileLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // limit each IP to 30 requests per hour
  message: 'Too many profile updates, please try again later'
});

// Community posts rate limiter
export const postLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 posts per hour
  message: 'Too many posts created, please try again later'
});

// Price tracking rate limiter
export const priceTrackingLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 requests per 5 minutes
  message: 'Too many price tracking requests, please try again later'
});

// Reviews rate limiter
export const reviewLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 reviews per hour
  message: 'Too many reviews submitted, please try again later'
});