import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status-codes";
import { getUser } from "../daos/Users";
import Joi, { ObjectSchema } from "joi";
import bcrypt from "bcrypt";
import { generateNewAuthenticationTokens } from "@shared/Authenticate";
import { getRequests, IRequestsFilter } from "@daos/Requests";

Joi.extend(require("@hapi/joi-date")); // allows for date formatting

const router = Router();

/**
 * GET: /requests
 */

interface IRequestsQuery extends IRequestsFilter {
  start: number;
  limit: number;
}

const RequestsQuery: ObjectSchema<IRequestsQuery> = Joi.object({
  start: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(25),
  author: Joi.string().alphanum().min(2).max(16, "utf8"),
  search: Joi.string().max(50, "utf8"),
  rewards: Joi.array()
    .items(Joi.string().guid({ version: "uuidv4" }).required())
    .default([]),
  createdAfter: (<any>Joi.date()).format("YYYY-MM-DD"),
  createdBefore: (<any>Joi.date()).format("YYYY-MM-DD"),
  completedAfter: (<any>Joi.date()).format("YYYY-MM-DD"),
  completedBefore: (<any>Joi.date()).format("YYYY-MM-DD"),
  completed: Joi.boolean(),
  completedBy: Joi.string().alphanum().min(2).max(16, "utf8"),
});

router.get("/requests", async (req: Request, res: Response) => {
  const { error, value } = RequestsQuery.validate(req.query);

  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  let requestQuery = value as IRequestsQuery;

  const matchedRequests = await getRequests(
    requestQuery.start,
    requestQuery.limit,
    requestQuery
  );

  return res.status(OK).json(matchedRequests);
});

export default router;
