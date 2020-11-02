import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import env from "./Environment";
import express, { Request, Response, NextFunction } from "express";
import { BAD_REQUEST, NOT_FOUND } from "http-status-codes";
import "express-async-errors";

import BaseRouter from "./routes";

// Init express
const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Development only settings
if (env.node_env === "development") {
  app.use(morgan("dev"));
  // Print API errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message,
    });
  });
}

// Production only settings
if (env.node_env === "production") {
  app.use(helmet()); // Security
}

// Add APIs
app.use("/api", BaseRouter);

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const staticDir = path.join(__dirname, "../react/build/");
app.use(express.static(staticDir));
app.get("*", (req: Request, res: Response) => {
  if (req.url.startsWith("/api")) {
    res.status(NOT_FOUND).end();
  } else {
    res.sendFile("index.html", { root: staticDir });
  }
});

// Export express instance
export default app;
