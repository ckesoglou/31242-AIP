import { Router } from "express";
import LoginRouter from "./Login";
import SignUpRouter from './SignUp';
import ItemRouter from './Item';

// Init router and path
const router = Router();

// Add sub-routes
router.use("/login", LoginRouter);
router.use("/signup", SignUpRouter);
router.use(ItemRouter);

// Export the base-router
export default router;
