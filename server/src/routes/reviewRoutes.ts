import express from "express";
import { addReview, getProductReviews, getUserReview } from "../controllers/reviewControllers";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/addReview/:productId", verifyToken, addReview);
router.get("/getProductReviews/:productId", verifyToken, getProductReviews);
router.get("/getUserReview/:productId/:user", verifyToken, getUserReview);

export default router;
