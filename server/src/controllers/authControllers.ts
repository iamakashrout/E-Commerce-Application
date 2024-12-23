import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/userSchema";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      phone,
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
      loyaltyPoints,
      createdAt,
    });

    const savedUser = await newUser.save();

    const userWithoutPassword = { ...savedUser.toObject(), password: undefined };
    const token = jwt.sign({ id: savedUser?._id }, process.env.JWT_SECRET as string, {
      expiresIn: "6h",
    });

    res.status(200).json({ token, user: userWithoutPassword });
    // res.status(201).json(savedUser);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // find requested user from database
    if (!user) {
      res.status(400).json({ msg: "User does not exist!" }); // user not found
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password); // compare with hashed password
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid credentials." }); // email, password did not match
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

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
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};