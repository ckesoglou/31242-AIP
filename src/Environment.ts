import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT ?? "3000",
  db_host: process.env.DB_HOST ?? "localhost",
  db_username: process.env.DB_USERNAME ?? "ioweyou",
  db_password: process.env.DB_PASSWORD ?? "",
  db_name: process.env.DB_NAME ?? "ioweyou",
};