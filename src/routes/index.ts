import { Router } from "express";
import LoginRouter from "./Login";
import SignUpRouter from './SignUp';
import UserRouter from './User';

// Init router and path
const router = Router();

// Add sub-routes
router.use("/login", LoginRouter);
router.use("/signup", SignUpRouter);
router.use(UserRouter);

// Export the base-router
export default router;
