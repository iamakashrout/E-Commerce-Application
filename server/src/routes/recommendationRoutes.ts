import express from "express";
import { getRecommendations } from "../controllers/recommendationController";

const router = express.Router();

// Route to get personalized product recommendations
router.get("/api/recommendations", getRecommendations);

export default router;
