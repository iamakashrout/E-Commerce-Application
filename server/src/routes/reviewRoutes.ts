import express from "express";
import { addReview, getProductReviews } from "../controllers/reviewControllers";

const router = express.Router();

router.post("/addReview", addReview);
router.get("/getProductReviews/:productId", getProductReviews);

export default router;