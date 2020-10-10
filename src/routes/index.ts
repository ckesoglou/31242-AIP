import { Router } from "express";
import LoginRouter from "./Login";
import SignUpRouter from './SignUp';
import UserRouter from "./Users";
import IouRouter from "./Ious";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/login", LoginRouter);
router.use("/signup", SignUpRouter);
router.use("/users", UserRouter);
router.use("/iou", IouRouter);

// Export the base-router
export default router;
