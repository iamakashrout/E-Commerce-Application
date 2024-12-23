import express from "express";
import { addAddress, getAddresses, removeAddress, updateAddress } from "../controllers/addressControllers";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Route to add/update address
router.post("/addAddress", verifyToken, addAddress);
router.post("/removeAddress", verifyToken, removeAddress);
router.post("/updateAddress", verifyToken, updateAddress);
router.get("/getAddresses/:user", verifyToken, getAddresses);

export default router;
