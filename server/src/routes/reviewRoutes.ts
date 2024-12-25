import express from "express";
import { addReview, getProductReviews } from "../controllers/reviewControllers";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// router.post("/addReview/:productId", verifyToken, addReview);
router.post("/addReview/:productId", addReview);
router.get("/getProductReviews/:productId", verifyToken, getProductReviews);

export default router;
