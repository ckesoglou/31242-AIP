import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT ?? "3000",
  db_host: process.env.DB_HOST ?? "ioweyou.database.windows.net",
  db_username: process.env.DB_USERNAME ?? "aip31242",
  db_password: process.env.DB_PASSWORD ?? "a36nP$N#P9u#dAYab7cmCEJu#jLikte7",
  db_name: process.env.DB_NAME ?? "ioweyou",
};
