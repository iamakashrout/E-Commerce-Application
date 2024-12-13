import express from "express";

import { login } from "../controllers/authControllers";
import { register } from "../controllers/authControllers";
import { logout } from "../controllers/authControllers";

const router = express.Router();

router.post("/validateReceipt", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
