import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Define an extended Request interface to include user data
interface AuthenticatedRequest extends Request {
    user?: string | object; // Adjust based on the structure of your token payload
  }

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      res.status(403).send("Access Denied");
      return;
    }

    // Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified; // Attach the payload to the request object
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Invalid token" });
  }
};
