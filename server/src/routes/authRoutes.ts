import express from "express";

import { forgotPassword, login, resetPassword } from "../controllers/authControllers";
import { register } from "../controllers/authControllers";
import { logout } from "../controllers/authControllers";
import {verifyOtp} from "../controllers/authControllers";

const router = express.Router();

router.post("/register", register);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword/:email", forgotPassword);
router.post("/resetPassword", resetPassword);

export default router;
