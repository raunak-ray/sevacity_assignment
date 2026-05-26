import ApiError from "../utils/ApiError.js";
import generateUUID from "../utils/uuid.js";
import orderRepository from "../repository/order.repository.js";
import assignmentRepository from "../repository/assignment.repository.js";
import orderLogRepository from "../repository/orderLog.repository.js";
import { ORDER_STATUS } from "../utils/constants.js";

class DeliveryService {
  async getMyOrders(deliveryBoyId) {
    return await orderRepository.findOrdersByDeliveryBoy(deliveryBoyId);
  }

  async updateMyOrderStatus({ orderId, status, deliveryBoyId }) {
    const allowedStatuses = [ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED];

    // Validate allowed statuses
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid status update");
    }

    // Check assignment
    const assignment = await assignmentRepository.findOrderAssignment(
      orderId,
      deliveryBoyId,
    );

    if (!assignment) {
      throw new ApiError(403, "Order not assigned to this delivery boy");
    }

    // Check order exists
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Prevent updates after delivery
    if (order.status === ORDER_STATUS.DELIVERED) {
      throw new ApiError(400, "Order already delivered");
    }

    // Prevent same status update
    if (order.status === status) {
      throw new ApiError(400, `Order already marked as ${status}`);
    }

    // Validate transition
    if (
      status === ORDER_STATUS.DELIVERED &&
      order.status !== ORDER_STATUS.IN_TRANSIT
    ) {
      throw new ApiError(400, "Order must be in transit before delivery");
    }

    // Update status
    await orderRepository.updateStatus(orderId, status);

    // Create order log
    await orderLogRepository.create({
      id: generateUUID(),

      order_id: orderId,

      old_status: order.status,

      new_status: status,

      actor_id: deliveryBoyId,
    });

    return {
      ...order,
      status,
    };
  }
}

export default new DeliveryService();
