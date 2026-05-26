import generateUUID from "../utils/uuid.js";
import ApiError from "../utils/ApiError.js";
import orderRepository from "../repository/order.repository.js";
import orderLogRepository from "../repository/orderLog.repository.js";
import { ORDER_STATUS } from "../utils/constants.js";

class OrderService {
  async createOrder(data, adminId) {
    const order = {
      id: generateUUID(),

      customer_name: data.customer_name,

      pickup_address: data.pickup_address,

      delivery_address: data.delivery_address,

      status: ORDER_STATUS.PENDING,

      created_by: adminId,
    };

    await orderRepository.create(order);

    return order;
  }

  async getOrders({ page, limit, status }) {
    page = Number(page) || 1;

    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    const result = await orderRepository.findAll({
      status,
      limit,
      offset,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: result.orders,

      pagination: {
        total: result.total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getOrderById(id) {
    const order = await orderRepository.findById(id);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return order;
  }

  async updateOrderStatus(orderId, status, actorId) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.status === ORDER_STATUS.DELIVERED) {
      throw new ApiError(400, "Delivered order cannot be updated");
    }

    await orderRepository.updateStatus(orderId, status);

    await orderLogRepository.create({
      id: generateUUID(),

      order_id: orderId,

      old_status: order.status,

      new_status: status,

      actor_id: actorId,
    });

    return {
      ...order,
      status,
    };
  }
}

export default new OrderService();
