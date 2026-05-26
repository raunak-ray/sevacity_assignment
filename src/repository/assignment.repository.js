import db from "../config/db.js";

class AssignmentRepository {
  async create(data) {
    const sql = `
      INSERT INTO assignments (
        id,
        order_id,
        delivery_boy_id
      )
      VALUES (?, ?, ?)
    `;

    await db.execute(sql, [data.id, data.order_id, data.delivery_boy_id]);

    return data;
  }

  async findByOrderId(orderId) {
    const sql = `
      SELECT *
      FROM assignments
      WHERE order_id = ?
    `;

    const [rows] = await db.execute(sql, [orderId]);

    return rows[0];
  }

  async countActiveAssignments(deliveryBoyId) {
    const sql = `
      SELECT COUNT(*) AS total

      FROM assignments a

      JOIN orders o
      ON a.order_id = o.id

      WHERE a.delivery_boy_id = ?

      AND o.status IN (
        'assigned',
        'in_transit'
      )
    `;

    const [rows] = await db.execute(sql, [deliveryBoyId]);

    return rows[0].total;
  }

  async findByDeliveryBoyId(deliveryBoyId) {
    const sql = `
      SELECT
        o.*
      FROM assignments a

      JOIN orders o
      ON a.order_id = o.id

      WHERE a.delivery_boy_id = ?

      ORDER BY a.assigned_at DESC
    `;

    const [rows] = await db.execute(sql, [deliveryBoyId]);

    return rows;
  }
}

export default new AssignmentRepository();
