import express from "express";

import { getAllProducts } from "../controllers/productControllers";
const router = express.Router();

router.get("/getAllProducts", getAllProducts as any);
router.get("/getProductById", getAllProducts as any);

export default router;
