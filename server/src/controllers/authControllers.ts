import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User, { IUser } from "../../models/userSchema";
import BlacklistedToken from "../../models/blacklistSchema";
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  id: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Name is required and must be a valid string' });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Validate password
    if (!password || password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long' });
      return;
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create a new user
    const user: IUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      console.error('ACCESS_TOKEN_SECRET is not set');
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    let accessToken: string;
    try {
      accessToken = jwt.sign({ id: user._id }, secret);
    } catch (error) {
      console.error('Error generating access token:', error);
      res.status(500).json({ error: 'Token generation failed' });
      return;
    }

    // Send the response
    res.json({ user, accessToken });
  } catch (error) {
    console.error('Error in register route:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordMinLength = 8;

  // Validate email and password
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }

  if (!password || password.length < passwordMinLength) {
    res.status(400).json({ error: `Password must be at least ${passwordMinLength} characters long` });
    return;
  }

  try {
    // Find the user by email
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid: boolean = await compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    // Generate the JWT token
    const secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      console.error("JWT secret is not defined.");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const tokenPayload = { id: user._id };
    const accessToken = jwt.sign({ id: tokenPayload.id }, secret);

    res.status(200).json({ message: "Logged in successfully", accessToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};


/* LOG OUT USER */
export const logout = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization token is missing or invalid" });
    return;
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token (to ensure it's valid before blacklisting)
    const secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      console.error("JWT secret is not defined.");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const decoded = jwt.verify(token, secret);
    if (!decoded) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    // Blacklist the token by saving it to the database
    await BlacklistedToken.create({ token });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Failed to logout" });
  }
};

