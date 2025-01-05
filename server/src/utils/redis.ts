import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS,
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

redisClient.on('error', (err) => console.error('Redis error:', err));

export default redisClient;


// import Redis from 'ioredis';

// const redis = new Redis({
//     host: process.env.REDIS_URL,
//     port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
//     password: process.env.REDIS_PASSWORD,
// });

// export default redis;