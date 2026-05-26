import asyncHandler from "../utils/asyncHandler.js";
import deliveryService from "../service/delivery.service.js";

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await deliveryService.getMyOrders(req.user.id);

  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const updateMyOrderStatus = asyncHandler(async (req, res) => {
  if (!req.body.status) {
    throw new ApiError(400, "Status field is required");
  }

  const order = await deliveryService.updateMyOrderStatus({
    orderId: req.params.id,

    status: req.body.status,

    deliveryBoyId: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: order,
  });
});
