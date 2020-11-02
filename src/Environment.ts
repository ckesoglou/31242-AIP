import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT ?? "3000",
  db_host: process.env.DB_HOST ?? "localhost",
  db_username: process.env.DB_USERNAME ?? "",
  db_password: process.env.DB_PASSWORD ?? "",
  db_name: process.env.DB_NAME ?? "",
  jwt_secret: process.env.JWT_SECRET ?? "ioweyou.tech",
  node_env: process.env.NODE_ENV,
};
