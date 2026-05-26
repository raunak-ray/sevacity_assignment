import asyncHandler from "../utils/asyncHandler.js";
import assignmentService from "../service/assignment.service.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

export const assignOrder = asyncHandler(async (req, res) => {
  if (!req.body.order_id || !req.body.delivery_boy_id) {
    throw new ApiError(400, "Order ID and Delivery Boy ID are required");
  }

  const assignment = await assignmentService.assignOrder({
    order_id: req.body.order_id,
    delivery_boy_id: req.body.delivery_boy_id,
    actor_id: req.user.id,
  });

  logger.api(req, 201, "Order assigned");

  res.status(201).json({
    success: true,
    data: assignment,
  });
});

export const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.getAssignments(req.params.id);

  logger.api(req, 200, "Assignments fetched");

  res.status(200).json({
    success: true,
    data: assignments,
  });
});
