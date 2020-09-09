import { Sequelize } from "sequelize";
import env from "../Environment";

const sequelize = new Sequelize(env.db_name, env.db_username, env.db_password, {
  host: env.db_host,
  dialect: "mssql",
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export default sequelize;
