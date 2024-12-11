import { Request, Response } from "express";
import User from "../models/userSchema"; // Assuming the address is stored in the User schema

/**
 * PUT /api/address
 * Add or update address details for a user.
 */
export const updateAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, address } = req.body;

    // Validate the request body
    if (!userId || !address) {
      res.status(400).json({ success: false, error: "User ID and address are required." });
      return;
    }

    // Update or add the address in the user document
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found." });
      return;
    }

    user.address = address; // Assuming "address" is a field in the User schema
    await user.save();

    res.status(200).json({ success: true, message: "Address updated successfully.", data: user });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, error: "Failed to update address." });
  }
};
