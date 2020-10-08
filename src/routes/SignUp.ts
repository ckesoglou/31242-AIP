import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import bcrypt from 'bcrypt';
import Joi, { string, ObjectSchema } from "joi";
import { v4 as uuid } from "uuid";
// import jwt from "jsonwebtoken";

import env from "../Environment";
import UserDao from "@daos/user/user-dao";
import { paramMissingError } from '@shared/constants';
import User, { IUser } from '@entities/User.ts';
// import { createToken } from "@daos/Tokens";

// Init shared
const router = Router();
const userDao = new UserDao();
const saltRounds = 10; //Salt Rounds determines how many times the password is hashed. 
                       //As bCrypt randomizes salts, this makes brute forcing and rainbow table attacks much more difficult.

/******************************************************************************
 *                      Create New User - "POST /api/signup/"
 * 
 *             - Assuming simple data validation is done in front end -
 ******************************************************************************/

interface ISignUpPOST {
    username: string;
    displayName: string;
    password: string;
  }

  const SignUpPOST: ObjectSchema<ISignUpPOST> = Joi.object({
    username: Joi.string().alphanum().min(2).max(16, "utf8"),
    password: Joi.string().min(8).pattern(/(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/).max(72, "utf8"),
    displayName: Joi.string().alphanum().min(2).max(16, "utf8"),
  }).options({ presence: "required" });

router.post('/', async (req: Request, res: Response) => {
    const { error, value } = SignUpPOST.validate(req.body);

    if (error) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    let request = value as ISignUpPOST;

    const foundUser = await userDao.getOne(request.username);
    if (foundUser) {
        return res.status(UNPROCESSABLE_ENTITY).json({
            error: "Username already exists", 
        });
    }

    let passHash: string = await bcrypt.hash(request.password, saltRounds)

    let User: IUser = {username: request.username, display_name: request.displayName, password_hash: passHash};
    await userDao.add(User);

    // const now = new Date();
    // const monthFromNow = new Date();
    // monthFromNow.setDate(monthFromNow.getDate() + 30);

    // const serverRefreshToken = await createToken(
    //     uuid(), 
    //     request.username,
    //     req.headers.host ?? "Unknown",
    //     now,
    //     monthFromNow
    // );
    // const clientRefreshToken = jwt.sign(
    //     {
    //     username: request.username,
    //     token: serverRefreshToken.refresh_token,
    //     },
    //     env.jwt_secret,
    //     { expiresIn: "30 days" }
    // );
    // const clientAccessToken = jwt.sign(
    //     { username: request,.username },
    //     env.jwt_secret,
    //     { expiresIn: "30m" }
    // );

    return res.cookie("access_tokens", {
        access_token: "clientAccessToken",
        refresh_token: "clientRefreshToken",
    });
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
