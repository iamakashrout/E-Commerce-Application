import { Request, Response } from "express";
import Order from "../models/orderSchema";
import Product from "../models/productSchema";
import User from "../models/userSchema";
import Cart from "../models/cartSchema";


// place an order
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, products, paymentMode, address, total } = req.body;

        // Validate required fields (basic validation)
        if (!user || !products || products.length === 0 || !paymentMode || !address || !total) {
            res.status(400).json({ success: false, error: 'Missing required fields.' });
            return;
        }

        for (const product of products) {
            const currProd = await Product.findOne({ id: product.productId });
            if (!currProd) {
                res.status(400).json({ success: false, error: 'Product does not exist' });
                return;
            }
            if (product.quantity > currProd.stock) {
                res.status(400).json({ success: false, error: 'Insufficient stock of products' });
                return;
            }
        }

        // Create a new order
        const newOrder = new Order({
            user,
            products,
            paymentMode,
            address,
            total,
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        // Respond with the saved order
        res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            data: savedOrder,
        });

        for (const product of products) {
            const currProd = await Product.findOne({ id: product.productId });
            if (!currProd) {
                res.status(400).json({ success: false, error: 'Product does not exist' });
                return;
            }
            currProd.stock = currProd.stock - product.quantity;
            await currProd.save();
        }

        const cart = await Cart.findOne({user}); // update cart
        if(cart){
            for (const product of products) {
                const itemIndex = cart.items.findIndex((item) => item.productId === product.productId);
                if (itemIndex > -1) {
                    if (product.quantity && cart.items[itemIndex].quantity > product.quantity) {
                      cart.items[itemIndex].quantity -= product.quantity;
                    } else {
                      cart.items.splice(itemIndex, 1);
                    }
                  } 
            }
            await cart.save();
        }

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, error: "Failed to place order" });
    }
};


// view all orders of a user
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user } = req.params;

        const existingUser = await User.findOne({ email: user });
        if (!existingUser) {
            res.status(400).json({ success: false, error: "User does not exist" });
            return;
        }

        const orders = await Order.find({ user });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, error: "Failed to fetch all orders" });
    }
}

// view details of a particular order
export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;

        const existingOrder = await Order.findOne({ orderId });
        if (!existingOrder) {
            res.status(400).json({ success: false, error: "Invalid order ID" });
            return;
        }

        res.status(200).json({ success: true, data: existingOrder });
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ success: false, error: "Failed to fetch order details" });
    }
}

// cancel an order
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ orderId });
        if (!order) {
            res.status(400).json({ success: false, error: "Invalid order ID" });
            return;
        }
        order.status = 'Cancelled';
        const updatedOrder = await order.save();

        res.status(200).json({ success: true, message: "Order cancelled successfully", data: updatedOrder });

        // update stock of products
        for (const product of order.products) {
            const currProd = await Product.findOne({id: product.productId});
            if(!currProd) {
                res.status(400).json({ success: false, error: 'Product does not exist' });
                return;
            }
            currProd.stock = currProd.stock + product.quantity;
            await currProd.save();
        }
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ success: false, error: "Failed to cancel the order" });
    }
}
