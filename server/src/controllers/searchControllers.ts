import { Request, Response } from 'express';
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis-14791.c239.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 14791,
    password: 'DBzw2Y1E0yVNIq4iccVH9VywlYWQA1TS',
});

// Save search query
export const  saveSearch = async (req: Request, res: Response): Promise<void> => {
    const { userId, query } = req.body;
    if (!userId || !query) {
        res.status(400).json({ error: 'User ID and query are required' });
        return;
    }

    try {
        // Use sorted set to store searches, ensuring uniqueness
        await redis.zadd(`user:${userId}:searches`, Date.now(), query);
        res.status(200).json({ message: 'Search saved successfully' });
    } catch (error) {
        console.error('Error saving search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch past searches based on query
export const  getSearches = async (req: Request, res: Response): Promise<void> => {
    const { userId, query } = req.query;
    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }

    try {
        // Fetch all past searches and filter by query
        const searches = await redis.zrange(`user:${userId}:searches`, 0, -1);
        const filtered = searches.filter((search: string) =>
            search.toLowerCase().includes((query as string)?.toLowerCase())
        );
        res.status(200).json({ searches: filtered });
    } catch (error) {
        console.error('Error fetching searches:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};