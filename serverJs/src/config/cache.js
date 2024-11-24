
// src/config/cache.js
const Redis = require('redis');
const { redisURL } = require('./environment');

const redisClient = Redis.createClient({
  url: redisURL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Connected'));

module.exports = redisClient;
