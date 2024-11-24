
// src/middleware/cache.js
const redisClient = require('../config/cache');

const cache = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redisClient.get(key);
      
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      res.originalJson = res.json;
      res.json = async (body) => {
        await redisClient.setEx(key, duration, JSON.stringify(body));
        res.originalJson(body);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = { cache };