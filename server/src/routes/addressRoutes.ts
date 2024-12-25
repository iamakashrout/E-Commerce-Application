import express from "express";
import { addAddress, getAddresses, removeAddress, updateAddress } from "../controllers/addressControllers";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Route to add/update address
// router.post("/addAddress", verifyToken, addAddress);
// router.post("/removeAddress", verifyToken, removeAddress);
// router.post("/updateAddress", verifyToken, updateAddress);
// router.get("/getAddresses/:user", verifyToken, getAddresses);
router.post("/addAddress", addAddress);
router.post("/removeAddress", removeAddress);
router.post("/updateAddress", updateAddress);
router.get("/getAddresses/:user", getAddresses);

export default router;
