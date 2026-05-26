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
}

export default new UserRepository();
