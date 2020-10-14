import { Request, response, Response, Router } from "express";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status-codes";
import { getUser } from "../daos/Users";
import { getAuthenticatedUser } from "@shared/Authenticate";
import User from "@entities/User";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
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
