import express from "express";

import {
  register,
  login,
  refreshToken,
  logout,
} from "../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authRateLimiter from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.use(authRateLimiter);

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refreshToken);

router.post("/logout", authMiddleware, logout);

export default router;
