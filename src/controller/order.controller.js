import orderService from "../service/order.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user.id);

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

  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status,
    req.user.id,
  );

  res.status(200).json({
    success: true,
    data: order,
  });
});
