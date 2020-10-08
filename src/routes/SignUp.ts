import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import bcrypt from 'bcrypt';
import Joi, { ObjectSchema } from "joi";

import { createUser, getUser } from "@daos/Users";
import User from '@entities/User.ts';
import { generateNewAuthenticationTokens } from '@shared/Authenticate';

const router = Router();
//Salt Rounds determines how many times the password is hashed. 
//As bCrypt randomizes salts, this makes brute forcing and rainbow table attacks much more difficult.
const saltRounds = 10;

/**
 * POST: /signup
 */

interface ISignUpPOST {
  username: string;
  displayName: string;
  password: string;
}

const SignUpPOST: ObjectSchema<ISignUpPOST> = Joi.object({
  username: Joi.string().alphanum().min(2).max(16, "utf8"),
  password: Joi.string().min(8).max(72, "utf8")
    .ruleset.pattern(/(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/) // at least one uppercase and one symbol
    .rule({ message: "Password must have at least one uppercase character and symbol" }),
  displayName: Joi.string().trim().min(2).max(16, "utf8")
    .ruleset.pattern(/^[a-zA-Z0-9 ]*$/) // letters numbers and spaces
    .rule({ message: "Display name can only contain letters, numbers and spaces" }),
}).options({ presence: "required" });

router.post('/', async (req: Request, res: Response) => {
  const { error, value } = SignUpPOST.validate(req.body);

  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  const requestBody = value as ISignUpPOST;

  const foundUser = await getUser(requestBody.username);
  if (foundUser) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      errors: ["Username already exists"],
    });
  }

  const passHash: string = await bcrypt.hash(requestBody.password, saltRounds)

  const user = await createUser(requestBody.username, requestBody.displayName, passHash);
  await generateNewAuthenticationTokens(user, req.headers.host ?? "Unknown", res);

  return res.status(CREATED).end();
});

export default router;