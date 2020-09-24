import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import bcrypt from 'bcrypt';
import Joi, { string, ObjectSchema } from "joi";

import UserDao from "@daos/user/user-dao";
import { paramMissingError } from '@shared/constants';
import User, { IUser } from '@entities/User.ts';

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
    password: Joi.string().min(1).max(72, "utf8"),
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

    return res.status(CREATED).json({
        refreshToken: "",
        accessToken: ""
    });
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
