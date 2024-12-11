import express from 'express';
import authRoutes from "./routes/authRoutes";
import { connectToDatabase } from './mongo';

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());


// auth routes
app.use("/api/auth", authRoutes);


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