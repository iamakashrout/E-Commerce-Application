import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://redis-14791.c239.us-east-1-2.ec2.redns.redis-cloud.com:14791',
    password: 'DBzw2Y1E0yVNIq4iccVH9VywlYWQA1TS',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redisClient.connect();
})();

export default redisClient;
