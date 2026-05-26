import express from "express";
import env from "./utils/env.js";
import db from "./config/db.js";

const app = express();
const PORT = env.PORT || 3000;

const startServer = async () => {
  try {
    const connection = await db.getConnection();

    console.log("Database connected successfully");

    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);

    process.exit(1);
  }
};

startServer();
