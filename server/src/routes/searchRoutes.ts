import express from "express";

import { searchProduct } from "../controllers/searchControllers";

const router = express.Router();

router.get("/searchProduct", searchProduct);

export default router;