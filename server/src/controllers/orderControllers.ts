import { Request, Response } from "express";
import stripe from "stripe";
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


        for (const product of products) {
            const currProd = await Product.findOne({ id: product.productId });
            if (!currProd) {
                res.status(400).json({ success: false, error: 'Product does not exist' });
                return;
            }
            currProd.stock = currProd.stock - product.quantity;
            await currProd.save();
        }

        await Cart.findOneAndUpdate(
            { user }, // filter
            {
                $pull: { 
                    items: { productId: { $in: products.map(( p: any ) => p.productId) } } // remove products
                }
            },
            { new: true, upsert: false }
        );

        // Respond with the saved order
        res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            data: savedOrder,
        });

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

// Stripe payment gateway
export const paymentGateway = async (req: Request, res: Response): Promise<void> => {
    try {
        const {products}=req.body;
        const lineItems=products.map((product: any)=>({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name
                },
                unit_amount: product.price*100,
            },
            quantity: product.quantity
        }));

        const stripeInstance = new stripe(process.env.STRIPE_SECRET || '');

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/paymentStatus?status=True",
            cancel_url: "http://localhost:3000/paymentStatus?status=False"
        });

        res.status(200).json({success:true, id: session.id});
    } catch (error) {
        console.error("Payment gateway failed:", error);
        res.status(500).json({ success: false, error: "Failed to process payment" });
    }
}