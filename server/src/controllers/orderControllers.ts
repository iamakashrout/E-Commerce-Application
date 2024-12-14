import { Request, Response } from "express";
import Order from "../models/orderSchema";
import Product from "../models/productSchema";

export const placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, products, paymentMode, address, total } = req.body;

        // Validate required fields (basic validation)
        if (!user || !products || products.length === 0 || !paymentMode || !address || !total) {
            res.status(400).json({ success: false, error: 'Missing required fields.' });
            return;
        }

        for (const product of products) {
            const currProd = await Product.findOne({id: product.productId});
            if(!currProd) {
                res.status(400).json({ success: false, error: 'Product does not exist' });
                return;
            }
            if(product.quantity > currProd.stock) {
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
            const currProd = await Product.findOne({id: product.productId});
            if(!currProd) {
                res.status(400).json({ success: false, error: 'Product does not exist' });
                return;
            }
            currProd.stock = currProd.stock - product.quantity;
            await currProd.save();
        }

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, error: "Failed to place order" });
    }
};