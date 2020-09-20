import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import bcrypt from 'bcrypt';

import UserDao from "@daos/user/user-dao";
import { paramMissingError } from '@shared/constants';
import User, { IUser } from '@entities/User.ts';

// Init shared
const router = Router();
const userDao = new UserDao();
const saltRounds = 10;

/******************************************************************************
 *                      Create New User - "POST /api/signup/"
 * 
 *             - Assuming simple data validaiton is done in front end -
 ******************************************************************************/

router.post('/', async (req: Request, res: Response) => {
    const {username, displayName, password} = req.body;
    if (!username || !displayName || !password) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const foundUser = await userDao.getOne(username);
    if (foundUser) {
        return res.status(UNPROCESSABLE_ENTITY).json({
            error: "Username already exists", 
        });
    }

    let passHash: string = await bcrypt.hash(password, saltRounds)

    let User: IUser = {username: username, display_name: displayName, password_hash: passHash};
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