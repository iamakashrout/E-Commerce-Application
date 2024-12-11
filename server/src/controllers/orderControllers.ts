import { Request, Response } from "express";
import Order from "../models/orderSchema"; // Import your Order model
import Product from "../models/productSchema"; // Assuming orders reference products

/**
 * POST /api/order
 * Place an order.
 */
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, items, totalAmount, address, paymentMethod } = req.body;

    // Validate the request body
    if (!userId || !items || items.length === 0 || !totalAmount || !address || !paymentMethod) {
      res.status(400).json({ success: false, error: "Invalid input. All fields are required." });
      return;
    }

    // Verify each product in the order
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404).json({ success: false, error: `Product with ID ${item.productId} not found.` });
        return;
      }

      if (item.quantity > product.stock) {
        res.status(400).json({
          success: false,
          error: `Insufficient stock for product ${product.name}. Available stock: ${product.stock}.`,
        });
        return;
      }

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create the order
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      address,
      paymentMethod,
      status: "Pending", // Default status for a new order
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, error: "Failed to place order." });
  }
};

/**
 * GET /api/orders/:id
 * Get details of a specific order.
 */
export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the order by ID and populate product details
    const order = await Order.findById(id).populate("items.productId");

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found." });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ success: false, error: "Failed to fetch order details." });
  }
};
