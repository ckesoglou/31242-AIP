import { Request, response, Response, Router } from "express";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status-codes";
import { getUser } from "../daos/Users";
import { getAuthenticatedUser } from "@shared/Authenticate";
import User from "@entities/User";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const localUser = await getAuthenticatedUser(req, res);
  if (localUser) {
    const user = await getUser(localUser.username);
    if (!user) {
      return res.status(401).json({
        error: ["User no longer exists"],
      });
    }
    return res.status(OK).json({ user });
  } else {
    return res.status(401).json({
      errors: ["Not authenticated."],
    });
  }
});

export default router;
