import { Request, Response } from "express";
import User from "../models/userSchema"; // Import the User model

// Update the user's address
export const updateAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; 
    const { newAddress } = req.body; 

    // Validate input
    if (!newAddress) {
      res.status(400).json({ error: "New address is required." });
      return;
    }

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Update the user's addresses array
    user.addresses.push(newAddress); // Add the new address to the array

    // Save the updated user document
    const updatedUser = await user.save();

    // Send the updated user data as a response
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Failed to update address." });
  }
};
