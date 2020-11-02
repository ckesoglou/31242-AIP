import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status-codes";
import { getUser } from "../daos/Users";
import Joi, { ObjectSchema } from "joi";
import bcrypt from "bcrypt";
import { generateNewAuthenticationTokens } from "../shared/Authenticate";

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

router.post("/login", async (req: Request, res: Response) => {
  // Validate request parameters
  const { error, value } = LoginPOST.validate(req.body);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  const requestBody = value as ILoginPOST;
  const user = await getUser(requestBody.username);

  if (user) {
    // Verify password hash
    const match = await bcrypt.compare(
      requestBody.password,
      user.password_hash
    );
    // If correct password
    if (match) {
      await generateNewAuthenticationTokens(
        user,
        req.headers.host ?? "Unknown",
        res
      );

      return res.status(OK).end();
    }
  }

  return res.status(UNAUTHORIZED).json({
    errors: ["Username or password was incorrect"], // We do not specify which for security reasons
  });
});

/**
 * POST: /logout
 */

router.get("/logout", async (req: Request, res: Response) => {
  return res.status(OK).clearCookie("access_tokens").end();
});

export default router;
