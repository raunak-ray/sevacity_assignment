import swaggerJsdoc from "swagger-jsdoc";
import env from "../utils/env.js";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Delivery Management API",
      version: "1.0.0",
      description:
        "Backend API for Delivery Management System for Sewacity Assignment",
    },

    servers: [
      {
        url: `http://localhost:${env.PORT}`,
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
