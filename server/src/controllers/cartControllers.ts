import { Request, Response } from "express";
import Cart from "../models/cartSchema"; // Import your Cart model
import { ICartItem } from "../models/cartSchema";
import Product from "../models/productSchema"; // Assuming cart items reference products


// add product to user's cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("in controller");
    // const { user, productId, quantity } = req.body;
    const { user, productId, quantity }: { user: string; productId: string; quantity: number } = req.body;


    // Validate request
    if (!productId || quantity <= 0) {
      res.status(400).json({ success: false, error: "Invalid product ID or quantity" });
      return;
    }

    // Check if the product exists
    const product = await Product.findOne({id: productId});
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    var cart = await Cart.findOne({ user }); // find user's cart

    const newItem: ICartItem = {
      productId: productId,
      quantity: quantity,
    }

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId === productId);
  
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity; // Increment quantity
      } else {
        
        cart.items.push(newItem); // Add new item
      }
    } else {
      cart = new Cart({
        user: user,
        items: [newItem],
      });
    }

    const updatedCart = await cart.save();
    res.status(201).json({ success: true, data: updatedCart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ success: false, error: "Failed to add item to cart" });
  }
};


// get user's cart
export const getCartDetails = async (req: Request, res: Response): Promise<void> => {
  const { user } = req.params;
  try {
    // Fetch all cart items with product details populated
    const cart = await Cart.findOne({ user });
    if (!cart) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ success: false, error: "Failed to fetch cart details" });
  }
};


// remove product from cart
export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, productId, quantity }: { user: string; productId: string; quantity?: number } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ user });
    if (!cart) {
      res.status(404).json({ success: false, error: "Cart not found" });
      return;
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (itemIndex > -1) {
      if (quantity && cart.items[itemIndex].quantity > quantity) {
        // Reduce the quantity if specified and greater than the amount to be removed
        cart.items[itemIndex].quantity -= quantity;
      } else {
        // Remove the item entirely if no quantity is specified or if quantity <= current quantity
        cart.items.splice(itemIndex, 1);
      }
    } else {
      res.status(404).json({ success: false, error: "Item not found in cart" });
      return;
    }

    const updatedCart = await cart.save();
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: false, error: "Failed to remove item from cart" });
  }
};
