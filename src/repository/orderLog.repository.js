import db from "../config/db.js";

class OrderLogRepository {
  async create(logData) {
    const sql = `
      INSERT INTO order_logs (
        id,
        order_id,
        old_status,
        new_status,
        actor_id
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      logData.id,
      logData.order_id,
      logData.old_status,
      logData.new_status,
      logData.actor_id,
    ]);
  }
}

export default new OrderLogRepository();
