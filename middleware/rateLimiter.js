// middleware/rateLimiter.js

const rateLimit   = require('express-rate-limit');
const RedisStore  = require('rate-limit-redis');
const { redisClient } = require('../config/redisClient');

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // limit each IP to 30 requests per windowMs
  message: 'Too many requests from this IP, please try again after a minute.',
  standardHeaders: true,   // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false,    // Disable the X-RateLimit-* headers

  // Pass your ioredis instance directly:
  store: new RedisStore({
    client: redisClient
  })
});

module.exports = { rateLimiter };
