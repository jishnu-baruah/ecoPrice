
// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests, please try again later.'
    }
  });
};

// Rate limiters as specified in requirements
const limiters = {
  anonymous: createRateLimiter(15 * 60 * 1000, 100),  // 100 requests per 15 minutes
  authenticated: createRateLimiter(15 * 60 * 1000, 1000), // 1000 requests per 15 minutes
  search: createRateLimiter(60 * 1000, 50),           // 50 requests per minute
  auth: createRateLimiter(60 * 1000, 10)              // 10 requests per minute
};

module.exports = limiters;