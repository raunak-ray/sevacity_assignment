import express from "express";
import env from "./utils/env.js";
import db from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import orderRoutes from "./routes/order.route.js";
import assignmentRoutes from "./routes/assignment.route.js";
import deliveryRoutes from "./routes/delivery.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();
const PORT = env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/delivery", deliveryRoutes);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    const connection = await db.getConnection();

    logger.success("Database connected successfully");

    connection.release();

    app.listen(PORT, () => {
      logger.success(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);

    process.exit(1);
  }
};

startServer();
