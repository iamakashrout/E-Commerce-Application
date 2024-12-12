// import { Request, Response } from "express";
// import Wishlist from "../models/wishlistSchema"; // Import your Wishlist model
// import Product from "../models/productSchema"; // Assuming wishlist items reference products

// /**
//  * POST /api/wishlist
//  * Add an item to the wishlist.
//  */
// export const addItemToWishlist = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { productId } = req.body;

//     // Validate request
//     if (!productId) {
//       res.status(400).json({ success: false, error: "Product ID is required" });
//       return;
//     }

//     // Check if the product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       res.status(404).json({ success: false, error: "Product not found" });
//       return;
//     }

//     // Check if the product is already in the wishlist
//     const existingItem = await Wishlist.findOne({ product: productId });
//     if (existingItem) {
//       res.status(400).json({ success: false, error: "Product is already in the wishlist" });
//       return;
//     }

//     // Add the item to the wishlist
//     const wishlistItem = await Wishlist.create({
//       product: productId,
//     });

//     res.status(201).json({ success: true, data: wishlistItem });
//   } catch (error) {
//     console.error("Error adding item to wishlist:", error);
//     res.status(500).json({ success: false, error: "Failed to add item to wishlist" });
//   }
// };

// /**
//  * GET /api/wishlist
//  * Get wishlist details.
//  */
// export const getWishlistDetails = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Fetch all wishlist items with product details populated
//     const wishlistItems = await Wishlist.find().populate("product");

//     res.status(200).json({ success: true, data: wishlistItems });
//   } catch (error) {
//     console.error("Error fetching wishlist details:", error);
//     res.status(500).json({ success: false, error: "Failed to fetch wishlist details" });
//   }
// };
