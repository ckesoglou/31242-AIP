import env from "./Environment";

import app from "@server";
import logger from "@shared/Logger";

// Start the server
const port = Number(env.port || 3000);
app.listen(port, () => {
  logger.info("Express server started on port: " + port);
});
