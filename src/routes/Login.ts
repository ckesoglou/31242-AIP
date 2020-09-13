import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { getUser } from "../daos/User";
import User from "../entities/User";
import Joi, { string, ObjectSchema } from "joi";

interface ILoginPOST {
  username: string;
  password: string;
}

const LoginPOST: ObjectSchema<ILoginPOST> = Joi.object({
  username: Joi.string().alphanum().min(2).max(16, "utf8"),
  password: Joi.string().min(1).max(72, "utf8"),
}).options({ presence: "required" });

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { error, value } = LoginPOST.validate(req.body);

  if (!error) {
    let request = value as ILoginPOST;
    const user = await getUser(request.username);

    if (!user) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError,
      });
    }
  }

  return res.status(CREATED).end();
});

export default router;
