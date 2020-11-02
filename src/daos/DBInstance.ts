import { Sequelize } from "sequelize";
import { initialiseIouRelationships } from "../models/Iou";
import { initialiseOfferRelationships } from "../models/Offer";
import { initialiseTokenRelationships } from "../models/Token";
import env from "../Environment";
import { createLeaderboardViewSQL, dropLeaderboardViewSQL } from "./Scores";

// Override timezone formatting so javascript date objects can be converted to a mssql format
// Resolves https://github.com/sequelize/sequelize/issues/7930
(<any>Sequelize).DATE.prototype._stringify = function _stringify(
  date: any,
  options: any
) {
  return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss.SSS");
};

const sequelize =
  env.node_env === "test" || env.persistent === "false"
    ? new Sequelize("sqlite::memory:", { logging: false }) // Database runs in memory on test environments
    : new Sequelize(env.db_name, env.db_username, env.db_password, {
        host: env.db_host,
        dialect: "mssql",
        logging: false,
      });

sequelize.sync().then(async () => {
  await initialiseTokenRelationships();
  await initialiseIouRelationships();
  await initialiseOfferRelationships();
  await sequelize.query(dropLeaderboardViewSQL);
  await sequelize.query(createLeaderboardViewSQL);

  console.log("Database tables and view created");
});

export default sequelize;
