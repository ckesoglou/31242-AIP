import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import Joi, { ObjectSchema } from "joi";

import { paramMissingError } from "@shared/constants";
import { getAuthenticatedUser } from "@shared/Authenticate";
import User from "@entities/User";
import {
  getIousOwed,
  createIouOwed,
  completeIouOwed,
  getIousOwe,
  createIouOwe,
  completeIouOwe,
  iouExists,
} from "@daos/Ious";

// Init shared
const router = Router();
interface IIouOwedPOST {
  username: string;
  item: string;
  proof: string;
}
const IouOwedPOST: ObjectSchema<IIouOwedPOST> = Joi.object({
  username: Joi.string(),
  item: Joi.string(),
  proof: Joi.string(),
}).options({ presence: "required" });
interface IIouOwePOST {
  username: string;
  item: string;
}
const IouOwePOST: ObjectSchema<IIouOwePOST> = Joi.object({
  username: Joi.string(),
  item: Joi.string(),
}).options({ presence: "required" });

/******************************************************************************
 *                      Get IOUs you are owed - "GET /api/iou/owed"
 ******************************************************************************/

router.get("/owed", async (req: Request, res: Response) => {
  const user = await getAuthenticatedUser(req, res);
  if (user) {
    const iou = await getIousOwed(user.username);
    return res.status(OK).json({ iou });
  } else {
    return res.status(401).json({
      errors: ["Not authenticated"],
    });
  }
});

/******************************************************************************
 *                      Create IOU you are owed - "POST /api/iou/owed"
 ******************************************************************************/

router.post("/owed", async (req: Request, res: Response) => {
  // Validate request format
  const { error, value } = IouOwedPOST.validate(req.body);
  if (error) {
    return res.status(BAD_REQUEST).json({
      error: [error.message],
    });
  }
  // Get authenticated user
  const user = await getAuthenticatedUser(req, res);
  if (user) {
    // Create new IOU
    const requestBody = value as IIouOwedPOST;
    const iou = await createIouOwed(
      requestBody.username,
      user.username,
      requestBody.item,
      requestBody.proof
    );
    return res.status(OK).json({ iou });
  } else {
    return res.status(401).json({
      errors: ["Not authenticated"],
    });
  }
});

/******************************************************************************
 *                       Mark an IOU as completed - "PUT /api/iou/owed/{iouID}/complete"
 ******************************************************************************/
router.get("/p/:tagId", function (req, res) {
  res.send("tagId is set to " + req.params.tagId);
});

router.put("/owed/:iouID/complete", async (req: Request, res: Response) => {
  const iouID = req.params.iouID;

  // Get authenticated user
  const user = await getAuthenticatedUser(req, res);
  // if logged in
  if (user) {
    // if IOU exists
    if (await iouExists(iouID)) {
      // if users is receiver of IOU
      if ((await completeIouOwed(iouID, user.username)) == true) {
        return res.status(OK).end();
      } else {
        return res.status(403).json({
          errors: [
            "Not authorised to complete this request (you are not the owner of it)",
          ],
        });
      }
    } else {
      return res.status(404).json({
        errors: ["Not found (did you mean to use the /owe endpoint)"],
      });
    }
  } else {
    return res.status(401).json({
      errors: ["Not authenticated"],
    });
  }
});

/******************************************************************************
 *                      Get IOUs you owe - "GET /api/iou/owe"
 ******************************************************************************/

router.get("/owe", async (req: Request, res: Response) => {
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  const iou = await getIousOwe(username);
  if (!iou) {
    return res.status(401).json({
      error: paramMissingError,
    });
  }
  return res.status(OK).json({ iou });
});

/******************************************************************************
 *                      Create IOU you owe - "POST /api/iou/owe"
 ******************************************************************************/

router.post("/owe", async (req: Request, res: Response) => {
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;

  const { error, value } = IouOwePOST.validate(req.body);
  if (error) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  let request = value as IIouOwePOST;
  const iou = await createIouOwe(username, request.username, request.item);
  if (!iou) {
    return res.status(401).json({
      error: paramMissingError,
    });
  }
  return res.status(OK).json({ iou });
});

/******************************************************************************
 *                       Mark an IOU as completed - "PUT /api/iou/owe/{iouID}/complete"
 ******************************************************************************/

router.put("/owe/complete", async (req: Request, res: Response) => {
  const { iouID } = req.body;
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  // TODO: handle 400 responses
  if (!(await completeIouOwe(username, iouID))) {
    return res.status(401).json({
      error: paramMissingError,
    });
  }
  return res.status(200).end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
