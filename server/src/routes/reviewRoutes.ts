import express from "express";
import { addReview, getProductReviews, getUserReview } from "../controllers/reviewControllers";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/addReview", verifyToken, addReview);
router.get("/getProductReviews/:productId", verifyToken, getProductReviews);
router.get("/getUserReview/:orderId/:productId", verifyToken, getUserReview);

export default router;
