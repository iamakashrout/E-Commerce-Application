import { Request, Response } from "express";
import Product from '../models/productSchema';
export const searchProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
        res.status(400).json({ message: 'Query parameter is required' });
        return;
    }

    const searchRegex = new RegExp(query as string, 'i'); 

    const products = await Product.find({
        $or: [
            { name: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
        ],
    });

    res.status(200).json(products);
} catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Server error' });
}
};
