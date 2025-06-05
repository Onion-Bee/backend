const { redisClient } = require('../config/redisClient');

// Cache middleware for GET /api/v1/chapters
const cache = async (req, res, next) => {
  try {
    // Create a key based on URL including query params
    const key = `chapters:${req.originalUrl}`;
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    // attach key to req for later use in controller
    req.cacheKey = key;
    next();
  } catch (err) {
    console.error('Cache error:', err);
    next();
  }
};

module.exports = { cache };