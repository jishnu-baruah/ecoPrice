// src/config/environment.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  redisURL: process.env.REDIS_URL,
  environment: process.env.NODE_ENV || 'development'
};