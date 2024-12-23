import { Request, Response } from "express";
import User from "../models/userSchema";

export const getUserDetails = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const { email } = req.params;
        const userDetails = await User.findOne({ email });
        if(!userDetails){
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        res.status(200).json({ success: true, data: userDetails });

    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ success: false, error: "Failed to fetch user details" });
    }
};