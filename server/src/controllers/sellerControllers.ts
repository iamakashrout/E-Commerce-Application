import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Seller from "../models/sellerSchema";
import Product from "../models/productSchema";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Order from "../models/orderSchema";
dotenv.config();

// ADD NEW SELLER
export const sellerRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, createdAt } = req.body;

    // validation
    if (!name || !email || !password) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    // check if email and name is unique
    const existingUser = await Seller.findOne({
      $or: [{ email }, { name }],
    });
    if (existingUser) {
      res
        .status(409)
        .json({ error: "Seller name and email should be unique." });
      return;
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newSeller = new Seller({
      name,
      email,
      password: passwordHash,
      createdAt,
    });

    const savedSeller = await newSeller.save();

    const sellerWithoutPassword = {
      ...savedSeller.toObject(),
      password: undefined,
    };
    const token = jwt.sign(
      { id: savedSeller?._id },
      process.env.JWT_SECRET as string
    );

    res.status(200).json({ token, seller: sellerWithoutPassword });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: (err as Error).message });
  }
};

// SELLER LOGIN
export const sellerLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email }); // find requested seller from database
    if (!seller) {
      res.status(400).json({ msg: "Seller does not exist!" }); // seller not found
      return;
    }

    const isMatch = await bcrypt.compare(password, seller.password); // compare with hashed password
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid credentials." }); // email, password did not match
      return;
    }

    const token = jwt.sign(
      { id: seller._id },
      process.env.JWT_SECRET as string
    );

    // Exclude the password from the seller object
    const sellerWithoutPassword = { ...seller.toObject(), password: undefined };

    res.status(200).json({ token, seller: sellerWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Function to get all products for a specific seller
export const getSellersProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sellerName } = req.params;

    const existingSeller = await Seller.findOne({ name: sellerName });
    // Validate sellerId
    if (!existingSeller) {
      res.status(400).json({ success: false, error: "Seller does not exist" });
      return;
    }

    // Fetch products belonging to the seller
    const products = await Product.find({ sellerName }).populate("sellerName"); // populate seller info if needed

    // Send the response with the found products
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching seller's products:", error);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};

// UPDATE PRODUCT DETAILS (CAN ONLY BE DONE BY SELLER)
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { name, company, description, price, category, stock, images } =
      req.body;

    // Check if the product exists
    const product = await Product.findOne({ id: productId });
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // Update product fields
    if (name) {
      product.name = name;
    }
    if (company) {
      product.company = company;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (category) {
      product.category = category;
    }
    if (stock) {
      product.stock = stock;
    }
    if (images) {
      product.images = images;
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
export const removeProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    // Check if the product exists
    const product = await Product.findOne({ id: productId });
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // Remove the product from the database
    await product.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, error: "Failed to remove product" });
  }
};

// GET PRODUCT SALES DATA (CAN BE FETCHED BY SELLER)
export const getProductSales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    // Check if the product exists
    const product = await Product.findOne({ id: productId });
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    // Find all orders that contain this product
    const orders = await Order.find({ 'products.productId': productId });

    // Extract relevant sales data
    const salesData = orders.map((order) => {
      const productDetails = order.products.find(
        (item) => item.productId === productId
      );

      if (!productDetails) return null;

      return {
        orderId: order.orderId,
        quantity: productDetails.quantity,
        unitPrice: productDetails.price,
        total: productDetails.quantity * productDetails.price,
      };
    }).filter(data => data !== null); // Filter out null values

    res.status(200).json({ success: true, data: salesData });
  } catch (error) {
    console.error('Error fetching product sales data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product sales data' });
  }
};
