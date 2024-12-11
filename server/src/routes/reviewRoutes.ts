import express from "express";
import { submitReview } from "../controllers/reviewController";

const router = express.Router();

// Route to submit a product review
router.post("/api/review", submitReview);

export default router;
