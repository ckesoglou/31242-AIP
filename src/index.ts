import app from "@server";
import logger from "@shared/Logger";
import env from "./Environment";
import db from "./daos/DBInstance";

// Start the server
const port = Number(env.port || 3000);

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
