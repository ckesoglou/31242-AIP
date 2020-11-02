import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import { getAuthenticatedUser } from "@shared/Authenticate";
import { getUsers, IUsersFilter } from "../daos/Users";
import Joi, { ObjectSchema } from "joi";

const router = Router();

/**
 * GET: /users
 */

const UsersQuery: ObjectSchema<IUsersFilter> = Joi.object({
  start: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(25),
  search: Joi.string().max(50, "utf8"),
});

router.get("/users", async (req: Request, res: Response) => {
  // Validate request
  const { error, value } = UsersQuery.validate(req.query);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }
  // Get users based on search query
  let usersQuery = value as IUsersFilter;
  const users = await getUsers(usersQuery, false);

  return res.status(OK).json(users).end();
});

/**
 * GET: /user
 */

router.get("/user", async (req: Request, res: Response) => {
  // Get username and display_name of authenticated user
  const user = await getAuthenticatedUser(req, res);
  if (user) {
    return res.status(OK).json({
      username: user.username,
      display_name: user.display_name,
    });
  } else {
    return res.status(401).json({
      errors: ["Not authenticated."],
    });
  }
});

export default router;
