import express from "express";

import { login } from "../controllers/authControllers.js";
import { register } from "../controllers/authControllers.js";
import { logout } from "../controllers/authControllers.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;
