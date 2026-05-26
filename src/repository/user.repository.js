import db from "../config/db.js";

class UserRepository {
  async create(userData) {
    const sql = `
      INSERT INTO users (
        id,
        name,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      userData.id,
      userData.name,
      userData.email,
      userData.password,
      userData.role,
    ]);

    return userData;
  }

  async findByEmail(email) {
    const sql = `
      SELECT * FROM users
      WHERE email = ?
    `;

    const [rows] = await db.execute(sql, [email]);

    return rows[0];
  }

  async findById(id) {
    const sql = `
      SELECT * FROM users
      WHERE id = ?
    `;

    const [rows] = await db.execute(sql, [id]);

    return rows[0];
  }

  async findDeliveryBoys() {
    const sql = `
      SELECT
        u.id,
        u.name,
        u.email,
  
        COUNT(o.id) AS active_orders
  
      FROM users u
  
      LEFT JOIN assignments a
      ON u.id = a.delivery_boy_id
  
      LEFT JOIN orders o
      ON a.order_id = o.id
      AND o.status IN (
        'assigned',
        'in_transit'
      )
  
      WHERE u.role = 'delivery_boy'
  
      GROUP BY u.id
  
      ORDER BY active_orders ASC
    `;

    const [rows] = await db.execute(sql);

    return rows;
  }
}

export default new UserRepository();
