import { Request, Response } from "express";
import redisClient from "../utils/redis";

// Store a search term for a user
export const storeSearch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, searchTerm } = req.body;
    if (!userId || !searchTerm) {
      res.status(400).json({ error: "userId and searchTerm are required" });
      return;
    }

    const key = `user:${userId}:searches`;
    // Check for duplicates before adding
    const existingSearches = await redisClient.lRange(key, 0, -1);
    if (!existingSearches.includes(searchTerm)) {
      await redisClient.lPush(key, searchTerm); // Add to the start of the list
      await redisClient.lTrim(key, 0, 9); // Keep only the last 10 searches
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to store search term" });
  }
};

// Fetch past searches for a user
export const getPastSearches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, query } = req.query;
    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    const key = `user:${userId}:searches`;
    const searches = await redisClient.lRange(key, 0, -1); // Get all searches
    const filteredSearches = query
      ? searches.filter((search) =>
          search.toLowerCase().includes((query as string).toLowerCase())
        )
      : searches;

    res.json(filteredSearches);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch past searches" });
  }
};

// export const saveSearch = async (req: Request, res: Response): Promise<void> => {
//     const { userId, query } = req.body;
//     if (!userId || !query) {
//         res.status(400).json({ error: 'User ID and query are required' });
//         return;
//     }

//     try {
//         // Get existing searches
//         const existingData = await redis.hget(`user:${userId}`, 'searches');
//         const searches = existingData ? JSON.parse(existingData) : [];

//         // Add the new search query to the list (ensure no duplicates)
//         if (!searches.includes(query)) {
//             searches.push(query);
//         }

//         // Save updated searches in Redis
//         await redis.hset(`user:${userId}`, {
//             searches: JSON.stringify(searches),
//             lastUpdated: Date.now().toString(), // Optional metadata
//         });

//         res.status(200).json({ message: 'Search saved successfully' });
//     } catch (error) {
//         console.error('Error saving search:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// export const getSearches = async (req: Request, res: Response): Promise<void> => {
//     const { userId } = req.body;
//     console.log("userId", userId);
//     if (!userId) {
//         res.status(400).json({ error: 'User ID is required' });
//         return;
//     }

//     try {
//         // Fetch searches from Redis
//         const cachedData = await redis.hget(`user:${userId}`, 'searches');
//         const searches = cachedData ? JSON.parse(cachedData) : [];

//         res.status(200).json({ searches });
//     } catch (error) {
//         console.error('Error fetching searches:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
