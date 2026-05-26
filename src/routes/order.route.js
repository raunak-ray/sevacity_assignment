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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - pickup_address
 *               - delivery_address
 *             properties:
 *               customer_name:
 *                 type: string
 *                 example: Rahul
 *               pickup_address:
 *                 type: string
 *                 example: Salt Lake
 *               delivery_address:
 *                 type: string
 *                 example: Howrah
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - assigned
 *             - in_transit
 *             - delivered
 *             - cancelled
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
router.get("/", getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *       404:
 *         description: Order not found
 */
router.get("/:id", getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
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
 *                   - pending
 *                   - assigned
 *                   - in_transit
 *                   - delivered
 *                   - cancelled
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status update
 */
router.patch("/:id/status", updateOrderStatus);

export default router;
