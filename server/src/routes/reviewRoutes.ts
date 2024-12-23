import express from "express";
import { addReview, getProductReviews } from "../controllers/reviewControllers";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/addReview", verifyToken, addReview);
router.get("/getProductReviews/:productId", verifyToken, getProductReviews);

export default router;
