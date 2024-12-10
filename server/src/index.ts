import express from 'express';
import authRoutes from "./routes/authRoutes";
import { connectToDatabase } from './mongo';

const app = express();
const port = process.env.PORT || 5000;

app.use("/auth", authRoutes);

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