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
          search.toLowerCase().startsWith((query as string).toLowerCase())
        )
      : searches;

    res.json(filteredSearches);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch past searches" });
  }
};