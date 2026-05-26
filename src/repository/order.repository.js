import db from "../config/db.js";

class OrderRepository {
  async create(orderData) {
    const sql = `
      INSERT INTO orders (
        id,
        customer_name,
        pickup_address,
        delivery_address,
        status,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      orderData.id,
      orderData.customer_name,
      orderData.pickup_address,
      orderData.delivery_address,
      orderData.status,
      orderData.created_by,
    ]);

    return orderData;
  }

  async findAll({ status, limit, offset }) {
    limit = Number(limit);
    offset = Number(offset);

    let baseQuery = `
      FROM orders
      WHERE 1=1
    `;

    const values = [];

    // Filter by status
    if (status) {
      baseQuery += `
        AND status = ?
      `;

      values.push(status);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) AS total
      ${baseQuery}
    `;

    const [countRows] = await db.execute(countQuery, values);

    const total = countRows[0].total;

    // Get paginated orders
    const dataQuery = `
      SELECT *
      ${baseQuery}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const [rows] = await db.execute(dataQuery, values);

    return {
      orders: rows,
      total,
    };
  }

  async findById(id) {
    const sql = `
      SELECT *
      FROM orders
      WHERE id = ?
    `;

    const [rows] = await db.execute(sql, [id]);

    return rows[0];
  }

  async updateStatus(id, status) {
    const sql = `
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `;

    await db.execute(sql, [status, id]);
  }

  async findOrdersByDeliveryBoy(deliveryBoyId) {
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

export default new OrderRepository();
