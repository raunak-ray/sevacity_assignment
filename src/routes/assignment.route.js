import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  assignOrder,
  getAssignments,
} from "../controller/assignment.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.post("/", assignOrder);

router.get("/deliveryboy/:id", getAssignments);

export default router;
