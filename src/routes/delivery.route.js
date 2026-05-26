import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getMyOrders,
  updateMyOrderStatus,
} from "../controller/delivery.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("delivery_boy"));

router.get("/my-orders", getMyOrders);

router.patch("/my-orders/:id/status", updateMyOrderStatus);

export default router;
