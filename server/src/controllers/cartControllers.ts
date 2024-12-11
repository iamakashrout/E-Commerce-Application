import { Request, Response } from "express";
import Cart from "../models/cartSchema"; // Import your Cart model
import Product from "../models/productSchema"; // Assuming cart items reference products

export const addItemToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    // Validate request
    if (!productId || quantity <= 0) {
      res.status(400).json({ success: false, error: "Invalid product ID or quantity" });
      return;
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    // Add the item to the cart
    const cartItem = await Cart.create({
      product: productId,
      quantity,
    });

    res.status(201).json({ success: true, data: cartItem });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ success: false, error: "Failed to add item to cart" });
  }
};

export const getCartDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all cart items with product details populated
    const cartItems = await Cart.find().populate("product");

    res.status(200).json({ success: true, data: cartItems });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ success: false, error: "Failed to fetch cart details" });
  }
};

export const removeItemFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if the cart item exists
    const cartItem = await Cart.findById(id);
    if (!cartItem) {
      res.status(404).json({ success: false, error: "Cart item not found" });
      return;
    }

    // Remove the item from the cart
    await cartItem.deleteOne();

    res.status(200).json({ success: true, message: "Cart item removed successfully" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ success: false, error: "Failed to remove cart item" });
  }
};
