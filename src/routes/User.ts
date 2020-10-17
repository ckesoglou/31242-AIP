import { Request, Response, Router } from "express";
import { OK } from "http-status-codes";
import { getAuthenticatedUser } from "@shared/Authenticate";

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
