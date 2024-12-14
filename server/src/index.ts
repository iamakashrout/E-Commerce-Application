import express from 'express';
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import sellerRoutes from "./routes/sellerRoutes";
import addressRoutes from "./routes/addressRoutes";
import cartRoutes from "./routes/cartRoutes";
import { connectToDatabase } from './mongo';

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);

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