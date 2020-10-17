import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status-codes";
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
  const { error, value } = UsersQuery.validate(req.query);

  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  let usersQuery = value as IUsersFilter;
  const users = await getUsers(usersQuery);

  return res.status(OK).json(users).end();
});

export default router;
