import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError } from '@shared/constants';

// Init shared
const router = Router();
const userDao = new UserDao();

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
    const users = await userDao.getAll();

    for (let user of users) { //Could extract this function into the UserDAO
        if (user['name'] == username) { //Need to discuss the IUser interface
            return res.status(UNPROCESSABLE_ENTITY).json({
               error: "Username already exists", 
            });
        }
    }

    let user = {id: 0, name: username, email: "Something"};
    await userDao.add(user);

    return res.status(CREATED).json({
        refreshToken: "",
        accessToken: ""
    });
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;