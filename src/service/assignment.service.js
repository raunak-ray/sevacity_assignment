import generateUUID from "../utils/uuid.js";
import ApiError from "../utils/ApiError.js";
import assignmentRepository from "../repository/assignment.repository.js";
import orderRepository from "../repository/order.repository.js";
import userRepository from "../repository/user.repository.js";
import orderRepositoryLog from "../repository/orderLog.repository.js";
import { ORDER_STATUS, USER_ROLES } from "../utils/constants.js";

class AssignmentService {
  async assignOrder({ order_id, delivery_boy_id, actor_id }) {
    // Check order exists
    const order = await orderRepository.findById(order_id);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Check pending status
    if (order.status !== ORDER_STATUS.PENDING) {
      throw new ApiError(400, "Only pending orders can be assigned");
    }

    // Check existing assignment
    const existingAssignment =
      await assignmentRepository.findByOrderId(order_id);

    if (existingAssignment) {
      throw new ApiError(400, "Order already assigned");
    }

    // Check delivery boy exists
    const deliveryBoy = await userRepository.findById(delivery_boy_id);

    if (!deliveryBoy) {
      throw new ApiError(404, "Delivery boy not found");
    }

    // Validate role
    if (deliveryBoy.role !== USER_ROLES.DELIVERY_BOY) {
      throw new ApiError(400, "User is not a delivery boy");
    }

    // Max 3 active orders
    const activeAssignments =
      await assignmentRepository.countActiveAssignments(delivery_boy_id);

    if (activeAssignments >= 3) {
      throw new ApiError(
        400,
        "Delivery boy already has maximum active assignments",
      );
    }

    // Create assignment
    const assignment = {
      id: generateUUID(),

      order_id,

      delivery_boy_id,
    };

    await assignmentRepository.create(assignment);

    // Update order status
    await orderRepository.updateStatus(order_id, ORDER_STATUS.ASSIGNED);

    // Create order log
    await orderRepositoryLog.create({
      id: generateUUID(),

      order_id,

      old_status: ORDER_STATUS.PENDING,

      new_status: ORDER_STATUS.ASSIGNED,

      actor_id,
    });

    return assignment;
  }

  async getAssignments(deliveryBoyId) {
    return await assignmentRepository.findByDeliveryBoyId(deliveryBoyId);
  }
}

export default new AssignmentService();
