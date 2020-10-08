import { Router } from "express";
import LoginRouter from "./Login";
import SignUpRouter from './SignUp';

// Init router and path
const router = Router();

// Add sub-routes
router.use("/login", LoginRouter);
router.use("/signup", SignUpRouter);

// Export the base-router
export default router;