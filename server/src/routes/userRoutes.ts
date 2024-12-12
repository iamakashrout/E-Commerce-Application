import express from "express";
import { updateAddress } from "../controllers/userControllers";

const router = express.Router();

// Route to add/update address
router.put("/:userId/updateAddress", updateAddress);

export default router;
