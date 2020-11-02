import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import Joi, { ObjectSchema } from "joi";
import { getScores, getUserScores } from "../daos/Scores";
import { getAuthenticatedUser } from "../shared/Authenticate";

const router = Router();
const { QueryTypes } = require("sequelize");

interface ILeaderboardQuery {
  start: number;
  limit: number;
}

const LeaderboardQuery: ObjectSchema<ILeaderboardQuery> = Joi.object({
  start: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1).max(100),
});

/**
 * GET: /api/leaderboard
 */

router.get("/", async (req: Request, res: Response) => {
  // Validate request
  const { error, value } = LeaderboardQuery.validate(req.query);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }
  const leaderboardQuery = value as ILeaderboardQuery;
  // Get leaderboard values
  const scores = await getScores(
    leaderboardQuery.start,
    leaderboardQuery.limit
  );

  return res.status(OK).json(scores).end();
});

/**
 * GET: /api/leaderboard/me
 */

router.get("/me", async (req: Request, res: Response) => {
  // Get authenticated user
  const user = await getAuthenticatedUser(req, res);
  if (user) {
    // Get user-specific score
    const scores = await getUserScores(user);
    if (scores) {
      return res.status(OK).json(scores).end();
    } else {
      return res.status(BAD_REQUEST).json({
        errors: ["Scores do not exist for current logged in user"],
      });
    }
  } else {
    return res.status(401).json({
      errors: ["Not authenticated"],
    });
  }
});

export default router;
