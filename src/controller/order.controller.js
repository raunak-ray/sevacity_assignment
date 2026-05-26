import orderService from "../service/order.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user.id);

  logger.api(req, 201, "Order created");

  res.status(201).json({
    success: true,
    data: order,
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const status = req.query.status;

  const orders = await orderService.getOrders({
    page,
    limit,
    status,
  });

  logger.api(req, 200, "Orders fetched");

  res.status(200).json({
    success: true,
    data: orders.data,
    pagination: orders.pagination,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);

  logger.api(req, 200, "Order fetched");

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  if (!req.body.status) {
    throw new ApiError(400, "Status field is required");
  }

  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status,
    req.user.id,
  );

  logger.api(req, 200, "Order status updated");

  res.status(200).json({
    success: true,
    data: order,
  });
});
