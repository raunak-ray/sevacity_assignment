import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import roleMiddleware from "../middleware/role.middleware.js";

import {
  getDeliveryBoys,
  getMyOrders,
  updateMyOrderStatus,
} from "../controller/delivery.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Delivery
 *   description: Delivery management APIs
 */

/**
 * @swagger
 * /api/delivery/delivery-boys:
 *   get:
 *     summary: Get all delivery boys with active order count
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery boys fetched successfully
 *       403:
 *         description: Forbidden
 */
router.get(
  "/delivery-boys",
  authMiddleware,
  roleMiddleware("admin"),
  getDeliveryBoys,
);

router.use(authMiddleware, roleMiddleware("delivery_boy"));

/**
 * @swagger
 * /api/delivery/my-orders:
 *   get:
 *     summary: Get delivery boy assigned orders
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       403:
 *         description: Forbidden
 */
router.get("/my-orders", getMyOrders);

/**
 * @swagger
 * /api/delivery/my-orders/{id}/status:
 *   patch:
 *     summary: Update delivery order status
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - in_transit
 *                   - delivered
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status update
 *       403:
 *         description: Forbidden
 */
router.patch("/my-orders/:id/status", updateMyOrderStatus);

export default router;
