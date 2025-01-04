import express from "express";

import { saveSearch, getSearches} from "../controllers/searchControllers";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.post("/saveSearch", saveSearch);
router.post("/getSearches", getSearches);

export default router;