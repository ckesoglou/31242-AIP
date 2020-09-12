import app from "@server";
import logger from "@shared/Logger";
import env from "./Environment";
import db from "./daos/DBInstance";

// Start the server
const port = Number(env.port || 3000);
db.authenticate();

app.listen(port, () => {
  logger.info("Express server started on port: " + port);
});
