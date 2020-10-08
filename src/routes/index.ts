import { Router } from "express";
import LoginRouter from "./Login";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/login", LoginRouter);

// Export the base-router
export default router;
