import asyncHandler from "../utils/asyncHandler.js";
import assignmentService from "../service/assignment.service.js";

export const assignOrder = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.assignOrder({
    order_id: req.body.order_id,

    delivery_boy_id: req.body.delivery_boy_id,

    actor_id: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: assignment,
  });
});

export const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.getAssignments(req.params.id);

  res.status(200).json({
    success: true,
    data: assignments,
  });
});
