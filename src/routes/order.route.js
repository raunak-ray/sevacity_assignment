import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controller/order.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getOrderById);

router.patch("/:id/status", updateOrderStatus);

export default router;
