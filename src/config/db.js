import mysql from "mysql2/promise";
import env from "../utils/env.js";

class Database {
  static instance;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.pool = mysql.createPool({
      host: env.DB_HOST_NAME,
      port: env.DB_PORT,

      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,

      database: env.DB_NAME,

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    Database.instance = this;
  }

  getPool() {
    return this.pool;
  }
}

const database = new Database();

Object.freeze(database);

export default database.getPool();
