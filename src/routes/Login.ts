import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status-codes";
import { getUser } from "../daos/Users";
import Joi, { string, ObjectSchema } from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import env from "../Environment";
import User from "../entities/User";
import Token from "@entities/Token";
import { createToken } from "@daos/Tokens";

const router = Router();

/**
 * POST: /login
 */

interface ILoginPOST {
  username: string;
  password: string;
}

const LoginPOST: ObjectSchema<ILoginPOST> = Joi.object({
  username: Joi.string().alphanum().min(2).max(16, "utf8"),
  password: Joi.string().min(1).max(72, "utf8"),
}).options({ presence: "required" });

router.post("/", async (req: Request, res: Response) => {
  const { error, value } = LoginPOST.validate(req.body);

  if (error) {
    return res.status(BAD_REQUEST).json({
      error: error.message,
    });
  }

  let requestBody = value as ILoginPOST;
  const user = await getUser(requestBody.username);

  if (user) {
    const match = await bcrypt.compare(
      requestBody.password,
      user.password_hash
    );

    if (match) {
      const now = new Date();
      const monthFromNow = new Date();
      monthFromNow.setDate(monthFromNow.getDate() + 30);

      const serverRefreshToken = await createToken(
        uuid(),
        user.username,
        req.headers.host ?? "Unknown",
        now,
        monthFromNow
      );
      const clientRefreshToken = jwt.sign(
        {
          username: user.username,
          token: serverRefreshToken.refresh_token,
        },
        env.jwt_secret,
        { expiresIn: "30 days" }
      );
      const clientAccessToken = jwt.sign(
        { username: user.username },
        env.jwt_secret,
        { expiresIn: "30m" }
      );

      res.cookie("access_tokens", {
        access_token: clientAccessToken,
        refresh_token: clientRefreshToken,
      });

      return res.status(OK).end();
    }
  }

  return res.status(UNAUTHORIZED).json({
    error: "Username or password was incorrect", // We do not specify which for security reasons
  });
});

export default router;
