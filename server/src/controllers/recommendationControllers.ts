// import { Request, Response } from "express";
// import Product from "../models/productModel"; // Assuming the Product model is present for fetching recommendations
// import User from "../models/userSchema"; // Assuming the User model is present to get user preferences

// /**
//  * GET /api/recommendations
//  * Fetch personalized product recommendations based on user preferences or history.
//  */
// export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = req.user?.id; // Assuming you have authentication middleware that adds userId to the request

//     if (!userId) {
//       res.status(401).json({ success: false, error: "User not authenticated" });
//       return;
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ success: false, error: "User not found" });
//       return;
//     }

//     // Example: Fetching products based on user's past purchase or preferences (customize the logic)
//     const recommendations = await Product.find({
//       category: { $in: user.interests }, // Assuming the User model has 'interests' field
//     }).limit(5); // Fetching 5 recommendations

//     res.status(200).json({ success: true, data: recommendations });
//   } catch (error) {
//     console.error("Error fetching recommendations:", error);
//     res.status(500).json({ success: false, error: "Failed to fetch recommendations" });
//   }
// };
