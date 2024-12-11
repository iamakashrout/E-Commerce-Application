import express from "express";
import { addItemToWishlist, getWishlistDetails } from "../controllers/wishlistController";

const router = express.Router();

// Route to add an item to the wishlist
router.post("/api/wishlist", addItemToWishlist);

// Route to get wishlist details
router.get("/api/wishlist", getWishlistDetails);

export default router;
