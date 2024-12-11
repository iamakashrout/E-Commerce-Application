import { Request, Response } from "express";
import Product from "../models/productSchema"; // Import your Product model

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, minPrice, maxPrice, sortBy, order } = req.query;

    // Build the query object
    const query: Record<string, any> = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (category) {
      query.category = category; // Match the category exactly
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
    }

    // Set sorting options
    const sortField = sortBy ? (sortBy as string) : "createdAt"; // Default sorting by creation date
    const sortOrder = order === "desc" ? -1 : 1; // Default sorting in ascending order

    // Fetch products from the database
    const products = await Product.find(query).sort({ [sortField]: sortOrder });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ success: false, error: "Failed to fetch product" });
  }
};
