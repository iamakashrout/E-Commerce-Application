import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import OTPModel from '../models/OTP';
import User from "../models/userSchema";
import { sendEmail } from '../utils/sendEmail';
import dotenv from "dotenv";
dotenv.config();

// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       phone,
//       loyaltyPoints=0,
//       createdAt,
//     } = req.body;

//       // validation
//     if (!name || !email || !password) {
//       res.status(400).json({ error: "Name, email, and password are required." });
//       return;
//     }

//     // check if email is unique
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       res.status(409).json({ error: "Email already in use." });
//       return;
//     }

//     const salt = await bcrypt.genSalt();
//     const passwordHash = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       name,
//       email,
//       password: passwordHash,
//       phone,
//       loyaltyPoints,
//       createdAt,
//     });

//     const savedUser = await newUser.save();

//     const userWithoutPassword = { ...savedUser.toObject(), password: undefined };
//     const token = jwt.sign({ id: savedUser?._id }, process.env.JWT_SECRET as string);

//     res.status(200).json({ token, user: userWithoutPassword });
//     // res.status(201).json(savedUser);
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).json({ error: (err as Error).message });
//   }
// };

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, loyaltyPoints = 0 } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required." });
      return;
    }

    // Check if email is unique
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "Email already in use." });
      return;
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP to database with expiration time (5 minutes)
    await OTPModel.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send OTP via email
    await sendEmail(email, 'Email Verification OTP', `Your OTP is: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email', email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};


export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, name, password, phone, loyaltyPoints = 0 } = req.body;

    // Validate input
    if (!email || !otp || !password) {
      res.status(400).json({ error: "Email, OTP, and password are required." });
      return;
    }

    // Check if OTP exists
    const otpRecord = await OTPModel.findOne({ email });
    if (!otpRecord) {
      res.status(400).json({ error: "OTP not found. Please request a new OTP." });
      return;
    }

    // Check if OTP has expired
    if (otpRecord.expiresAt < new Date()) {
      await OTPModel.deleteOne({ email }); // Clean up expired OTP
      res.status(400).json({ error: "OTP has expired. Please request a new OTP." });
      return;
    }

    // Compare OTP securely
    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      res.status(400).json({ error: "Invalid OTP." });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      phone,
      loyaltyPoints,
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET as string);

    // Clean up OTP record
    await OTPModel.deleteOne({ email });

    // Return response
    const userWithoutPassword = { ...savedUser.toObject(), password: undefined };
    res.status(201).json({ message: "User registered successfully.", token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
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