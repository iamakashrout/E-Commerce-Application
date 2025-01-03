import express from 'express';
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import sellerRoutes from "./routes/sellerRoutes";
import addressRoutes from "./routes/addressRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import userRoutes from "./routes/userRoutes";
import searchRoutes from "./routes/searchRoutes";
import { connectToDatabase } from './mongo';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 5000;
// Middleware to parse JSON
app.use(express.json());
// Middleware to enable CORS
// app.use(cors());
app.use(cors({
  origin: "*",  
}));
// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/user", userRoutes);
app.use("/api/search", searchRoutes);
// MongoDB connection
const startApp = async () => {
  try {
      const db = await connectToDatabase();
  } catch (error) {
      console.error('Error:', error);
  }
};
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
startApp();