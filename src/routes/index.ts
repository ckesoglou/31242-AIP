import { Router } from "express";
import UserRouter from "./Users";
import IouRouter from "./Ious";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/users", UserRouter);
router.use("/iou", IouRouter);

// Export the base-router
export default router;
