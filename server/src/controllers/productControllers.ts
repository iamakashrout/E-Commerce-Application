import { Request, Response } from "express";
import Product from "../models/productSchema";
import Seller from "../models/sellerSchema";


// LIST ALL PRODUCTS
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Retrieve all products from the database without any filters
    const products = await Product.find();

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};


// GET PRODUCT BY PRODUCT ID (UNIQUE IDENTIFIER)
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params; // Get the productId from the URL parameters

    // Find the product by its ID
    const product = await Product.findOne({id: productId}) // Optionally populate seller details

    // If no product is found, return a 404 error
    if (!product) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    // Return the product details
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, error: "Failed to fetch product." });
  }
};

// ADD NEW PRODUCT
export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {id, name, company, description, price, category, stock, images, sellerName } = req.body;

    // Validation checks for required fields
    if (!id || !name || !company || !description || !price || !category || !stock || !sellerName) {
      res.status(400).json({ success: false, error: "All fields are required" });
      return;
    }

    const sellerExists = await Seller.findOne({name: sellerName});
    if (!sellerExists) {
      res.status(404).json({ success: false, error: "Seller not found" });
      return;
    }

    const productExists = await Product.findOne({id: id});
    if (productExists) {
      res.status(404).json({ success: false, error: "Product ID already exists" });
      return;
    }

    // Create a new product document
    const newProduct = new Product({
      id,
      name,
      company,
      description,
      price,
      category,
      stock,
      images: images || [],  // Default to an empty array if images are not provided
      sellerName,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Send a success response with the saved product data
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add product",
    });
  }
};


// SEARCH FOR PRODUCT USING CRITERIA
export const searchProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice, sortBy, order } = req.query;

    // Build the query object
    const query: Record<string, any> = {};

    if (name) { // product name
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    if (category) { // product category
      query.category = category; // Match the category exactly
    }

    if (minPrice || maxPrice) { // product price
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

