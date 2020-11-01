import { Sequelize } from "sequelize";
import env from "../Environment";

// Override timezone formatting so javascript date objects can be converted to a mssql format
// Resolves https://github.com/sequelize/sequelize/issues/7930
(<any>Sequelize).DATE.prototype._stringify = function _stringify(
  date: any,
  options: any
) {
  return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss.SSS");
};

const sequelize =
  env.node_env === "test"
    ? new Sequelize("sqlite::memory:", { logging: false }) // Database runs in memoery on test environments
    : new Sequelize(env.db_name, env.db_username, env.db_password, {
        host: env.db_host,
        dialect: "mssql",
        logging: false,
      });

export default sequelize;
