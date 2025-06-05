const Redis = require('ioredis');
require('dotenv').config();  


console.log('→ Using Redis Host:', process.env.REDIS_HOST);
console.log('→ Using Redis Port:', process.env.REDIS_PORT);
console.log('→ Using Redis Password:', process.env.REDIS_PASSWORD ? '*** (redacted) ***' : '(none)');
const redisOptions = {
  host: process.env.REDIS_HOST ,
  port: Number(process.env.REDIS_PORT) ,
  password: process.env.REDIS_PASSWORD,
};

const redisClient = new Redis(redisOptions);

redisClient.on('connect', () => {
  console.log('Redis connected');
});
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = { redisClient };