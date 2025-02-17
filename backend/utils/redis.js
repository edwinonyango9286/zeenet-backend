const { Redis } = require("ioredis");
const redis_uri = process.env.REDIS_URI

const redisClient = () => {
  if (process.env.REDIS_URI) {
    console.log("Redis connected.");
    return new Redis(process.env.REDIS_URI, {
      connectTimeout: 10000, 
      retryStrategy: (times) => {
        return Math.min(times * 500, 2000); 
      },
    });
  }
  throw new Error("Redis connection failed: REDIS_URI is not set.");
};

const redis = redisClient();

module.exports = redis;
