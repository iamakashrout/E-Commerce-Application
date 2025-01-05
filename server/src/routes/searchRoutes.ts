import express from "express";
import { verifyToken } from "../middleware/auth";
import { getPastSearches, storeSearch } from "../controllers/searchControllers";
const router = express.Router();

router.post("/storeSearch", storeSearch);
router.get("/getPastSearches", getPastSearches);

export default router;