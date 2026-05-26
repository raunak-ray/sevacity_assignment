import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import roleMiddleware from "../middleware/role.middleware.js";

import {
  assignOrder,
  getAssignments,
} from "../controller/assignment.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Order assignment APIs
 */

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Assign order to delivery boy
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - delivery_boy_id
 *             properties:
 *               order_id:
 *                 type: string
 *                 example: order-uuid
 *               delivery_boy_id:
 *                 type: string
 *                 example: delivery-boy-uuid
 *     responses:
 *       201:
 *         description: Order assigned successfully
 *       400:
 *         description: Invalid assignment request
 *       404:
 *         description: Order or delivery boy not found
 */
router.post("/", assignOrder);

/**
 * @swagger
 * /api/assignments/deliveryboy/{id}:
 *   get:
 *     summary: Get assignments of a delivery boy
 *     tags: [Assignments]
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
 *         description: Assignments fetched successfully
 *       404:
 *         description: Delivery boy not found
 */
router.get("/deliveryboy/:id", getAssignments);

export default router;
