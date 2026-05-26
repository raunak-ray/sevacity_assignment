import db from "../config/db.js";

class TokenRepository {
  async saveToken(tokenData) {
    const sql = `
      INSERT INTO refresh_tokens (
        id,
        user_id,
        token,
        expires_at
      )
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(sql, [
      tokenData.id,
      tokenData.user_id,
      tokenData.token,
      tokenData.expires_at,
    ]);
  }

  async findToken(token) {
    const sql = `
      SELECT * FROM refresh_tokens
      WHERE token = ?
    `;

    const [rows] = await db.execute(sql, [token]);

    return rows[0];
  }

  async deleteToken(token) {
    const sql = `
      DELETE FROM refresh_tokens
      WHERE token = ?
    `;

    await db.execute(sql, [token]);
  }
}

export default new TokenRepository();
