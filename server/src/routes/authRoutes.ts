import express from "express";

import { login } from "../controllers/authControllers";
import { register } from "../controllers/authControllers";
import { logout } from "../controllers/authControllers";

const router = express.Router();


// register new user
router.post("/register", register);

// login user
router.post("/login", login);

router.post("/logout", logout);

export default router;
