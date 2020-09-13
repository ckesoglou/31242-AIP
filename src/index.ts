import app from "src/server";
import logger from "@shared/logger";
import env from "./environment";
import db from "./daos/db-instance";

// Start the server
const port = Number(env.port || 4000);

async function dbconnect() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

dbconnect();

app.listen(port, () => {
  logger.info("Express server started on port: " + port);
});