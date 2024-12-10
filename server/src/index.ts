import express from 'express';
import authRoutes from "./routes/authRoutes";
const app = express();
const port = process.env.PORT || 5000;

app.use("/auth", authRoutes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

