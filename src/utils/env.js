import "dotenv/config";

const env = {
  PORT: process.env.PORT,
  DB_HOST_NAME: process.env.DB_HOST_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};

export default env;
