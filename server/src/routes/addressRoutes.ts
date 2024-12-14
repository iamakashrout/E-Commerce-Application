import express from "express";
import { addAddress, getAddresses, removeAddress, updateAddress } from "../controllers/addressControllers";

const router = express.Router();

// Route to add/update address
router.post("/addAddress", addAddress);
router.post("/removeAddress", removeAddress);
router.post("/updateAddress", updateAddress);
router.get("/getAddresses/:user", getAddresses);

export default router;
