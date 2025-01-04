import { Request, Response } from 'express';
const dotenv = require('dotenv');
dotenv.config();

import redis from '../redis/redisClient';
export const saveSearch = async (req: Request, res: Response): Promise<void> => {
    const { userId, query } = req.body; 
    if (!userId || !query) {
        res.status(400).json({ error: 'User ID and query are required' });
        return;
    }

    try {
        // Get existing searches
        const existingData = await redis.hget(`user:${userId}`, 'searches');
        const searches = existingData ? JSON.parse(existingData) : [];

        // Add the new search query to the list (ensure no duplicates)
        if (!searches.includes(query)) {
            searches.push(query);
        }

        // Save updated searches in Redis
        await redis.hset(`user:${userId}`, {
            searches: JSON.stringify(searches),
            lastUpdated: Date.now().toString(), // Optional metadata
        });

        res.status(200).json({ message: 'Search saved successfully' });
    } catch (error) {
        console.error('Error saving search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getSearches = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body; 
    console.log("userId", userId);
    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }

    try {
        // Fetch searches from Redis
        const cachedData = await redis.hget(`user:${userId}`, 'searches');
        const searches = cachedData ? JSON.parse(cachedData) : [];

        res.status(200).json({ searches });
    } catch (error) {
        console.error('Error fetching searches:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
