import { Request, Response } from "express";
import Seller from "../models/sellerSchema";
import Product from "../models/productSchema";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();


// ADD NEW SELLER
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
    const existingUser = await Seller.findOne({ name });
    if (existingUser) {
      res.status(409).json({ error: "Seller name already exists." });
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
    const { sellerName } = req.params;

    const existingSeller = await Seller.findOne({ name: sellerName });
    // Validate sellerId
    if (!existingSeller) {
      res.status(400).json({ success: false, error: "Seller does not exist" });
      return;
    }

    // Fetch products belonging to the seller
    const products = await Product.find({ sellerName }).populate('sellerName'); // populate seller info if needed

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


// UPDATE PRODUCT DETAILS (CAN ONLY BE DONE BY SELLER)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { name, company, description, price, category, stock, images } = req.body;

    // Check if the product exists
    const product = await Product.findOne({id: productId});
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // Update product fields
    if(name){
      product.name = name;
    }
    if(company){
      product.company = company;
    }
    if(description){
      product.description = description;
    }
    if(price){
      product.price = price;
    }
    if(category){
      product.category = category;
    }
    if(stock){
      product.stock = stock;
    }
    if(images){
      product.images = images
    }

    // Save the updated product
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Failed to update product" });
  }
};


// REMOVE A PRODUCT (CAN ONLY BE DONE BY SELLER)
export const removeProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    // Check if the product exists
    const product = await Product.findOne({id: productId});
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

