import asyncHandler from "../utils/asyncHandler.js";
import deliveryService from "../service/delivery.service.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await deliveryService.getMyOrders(req.user.id);

  logger.api(req, 200, "Delivery boy orders fetched");

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

  logger.api(req, 200, "Delivery order status updated");

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const getDeliveryBoys = asyncHandler(async (req, res) => {
  const deliveryBoys = await deliveryService.getDeliveryBoys();

  logger.api(req, 200, "Delivery boys fetched");

  res.status(200).json({
    success: true,
    data: deliveryBoys,
  });
});
