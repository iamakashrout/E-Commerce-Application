import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/userSchema";

interface JwtPayload {
  id: string;
}

/* REGISTER USER */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      phone,
      addresses=[],
      loyaltyPoints=0,
      createdAt,
    } = req.body;

      // validation
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required." });
      return;
    }

    // check if email is unique
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "Email already in use." });
      return;
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      phone,
      addresses,
      loyaltyPoints,
      createdAt,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/* LOG IN USER */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ msg: "User does not exist!" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid credentials." });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h", // Optional: set token expiration
    });

    // Exclude the password from the user object
    const userWithoutPassword = { ...user.toObject(), password: undefined };

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/* LOG OUT USER */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Invalidate the token by sending a message to the client
    res.status(200).json({ msg: "Logged out successfully." });

    // Note: Token invalidation isn't directly possible in stateless JWT. 
    // Options for token invalidation:
    // - Use a token blacklist stored in a database or cache (e.g., Redis).
    // - Adjust token expiry to be shorter and use a refresh token mechanism.
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
