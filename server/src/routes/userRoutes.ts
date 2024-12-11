import express from "express";
import { updateAddress } from "../controllers/addressController";

const router = express.Router();

// Route to add/update address
router.put("/api/address", updateAddress);

export default router;
