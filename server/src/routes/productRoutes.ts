import express from "express";

import { getAllProducts, getProductById, addProduct, searchProduct } from "../controllers/productControllers";
const router = express.Router();

router.get("/getAllProducts", getAllProducts);
router.get("/:productId/getProductById", getProductById);
router.post("/addProduct", addProduct);
router.post("/searchProduct", searchProduct);

export default router;
