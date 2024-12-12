import { Request, Response } from "express";
import Seller from "../models/sellerSchema";
import Product from "../models/productSchema";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const addSeller = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      createdAt,
    } = req.body;

    // validation
    if (!name || !email) {
      res.status(400).json({ error: "Name and email are required." });
      return;
    }

    // check if email is unique
    const existingUser = await Seller.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "Email already in use." });
      return;
    }

    const newUser = new Seller({
      name,
      email,
      createdAt,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: (err as Error).message });
  }
};

// Function to get all products for a specific seller
export const getSellersProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sellerId } = req.params;

    // Validate sellerId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      res.status(400).json({ success: false, error: "Invalid seller ID" });
      return;
    }

    // Fetch products belonging to the seller
    const products = await Product.find({ sellerId }).populate('sellerId'); // populate seller info if needed

    if (products.length === 0) {
      res.status(404).json({ success: false, error: "No products found for this seller" });
      return;
    }

    // Send the response with the found products
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching seller's products:", error);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, images } = req.body;

    // Validate the request body
    if (!name || !description || !price || !category || stock === undefined) {
      res.status(400).json({ success: false, error: "Missing required fields" });
      return;
    }

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // Update product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.stock = stock;
    product.images = images || product.images; // Only update images if provided

    // Save the updated product
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Failed to update product" });
  }
};

export const removeProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // Remove the product from the database
    await product.deleteOne();

    res.status(200).json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, error: "Failed to remove product" });
  }
};

