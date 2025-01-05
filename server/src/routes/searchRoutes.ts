import express from "express";

//import { saveSearch, getSearches} from "../controllers/searchControllers";
import { verifyToken } from "../middleware/auth";
import { getPastSearches, storeSearch } from "../controllers/searchControllers";
const router = express.Router();

router.post("/storeSearch", storeSearch);
router.get("/getPastSearches", getPastSearches);

// router.post("/saveSearch", saveSearch);
// router.post("/getSearches", getSearches);

export default router;