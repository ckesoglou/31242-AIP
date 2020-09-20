import { Sequelize } from "sequelize";
import env from "../environment";

const sequelize = new Sequelize(env.db_name, env.db_username, env.db_password, {
    host: env.db_host,
    dialect: "mssql",
});

export default sequelize;
