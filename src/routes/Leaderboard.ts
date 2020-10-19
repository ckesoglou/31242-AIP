import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import sequelize from "@daos/DBInstance";
import Joi, { ObjectSchema } from "joi";
import { getScores, getUserScores } from "@daos/Scores";
import { getAuthenticatedUser } from "@shared/Authenticate";

const router = Router();
const { QueryTypes } = require("sequelize");

interface ILeaderboardQuery {
  start: number;
  limit: number;
}

const LeaderboardQuery: ObjectSchema<ILeaderboardQuery> = Joi.object({
  start: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(25),
});

router.get("/", async (req: Request, res: Response) => {
  const { error, value } = LeaderboardQuery.validate(req.query);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }
  const leaderboardQuery = value as ILeaderboardQuery;

  const scores = await getScores(
    leaderboardQuery.start,
    leaderboardQuery.limit
  );

  return res.status(OK).json(scores).end();
});

router.get("/me", async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req, res);
  if (!user) {
    const scores = await getUserScores(user);
    if (scores) {
      return res.status(OK).json(scores).end();
    } else {
      return res.status(BAD_REQUEST).json({
        errors: ["Scores do not exist for current logged in user"],
      });
    }
  } else {
    return res.status(BAD_REQUEST).json({
      errors: ["User does not exist"],
    });
  }
});

export default router;
