import { Router } from "express";
import LoginRouter from "./Login";
import SignUpRouter from "./SignUp";
import RequestRouter from "./Request";
import UserRouter from "./User";
import IouRouter from "./Ious";
import ItemRouter from "./Item";
import LeaderboardRouter from "./Leaderboard";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/login", LoginRouter);
router.use("/signup", SignUpRouter);
router.use("/iou", IouRouter);
router.use(RequestRouter);
router.use("/leaderboard", LeaderboardRouter);
router.use(UserRouter);
router.use(ItemRouter);

// Export the base-router
export default router;
