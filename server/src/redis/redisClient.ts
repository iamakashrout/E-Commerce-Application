import { createClient } from 'redis';

const redisClient = createClient({
    // url: process.env.REDIS_URL, // Use Redis Cloud URL or local Redis
    url: 'redis://redis-14791.c239.us-east-1-2.ec2.redns.redis-cloud.com:14791',
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis successfully');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

export default redisClient;
