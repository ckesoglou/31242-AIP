import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";

import UserDao from "@daos/user/user-dao";
import { paramMissingError } from "@shared/constants";

// Init shared
const router = Router();
const userDao = new UserDao();

/******************************************************************************
 *                      Get current User - "GET /api/users/"
 ******************************************************************************/

router.get("/", async (req: Request, res: Response) => {
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  const user = await userDao.getOne(username);
  if (!user) {
    return res.status(401).json({
      error: paramMissingError,
    });
  }
  return res.status(OK).json({ user });
});

/******************************************************************************
 *                       Update current User - "PUT /api/users/"
 ******************************************************************************/

router.put("/", async (req: Request, res: Response) => {
  const { user } = req.body;
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  if (!(await userDao.update(username, user))) {
    return res.status(401).json({
      error: paramMissingError,
    });
  }
  return res.status(200).end();
});

/******************************************************************************
 *                       Delete current User - "DELETE /api/users/"
 ******************************************************************************/

router.delete("/", async (req: Request, res: Response) => {
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  if (!(await userDao.delete(username))) {
    return res.status(401).json({
      error: paramMissingError,
    });
  }
  return res.status(200).end();
});

/******************************************************************************
 *                       Logout current User - "GET /api/users/logout"
 ******************************************************************************/

router.get("/logout", async (req: Request, res: Response) => {
  res.cookie("access_tokens", {
    access_token: null,
    refresh_token: null,
  });
  return res.status(200).end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
