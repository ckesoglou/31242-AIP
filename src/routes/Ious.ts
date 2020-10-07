import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";

import IouDao from "@daos/iou/iou-dao";
import { paramMissingError } from "@shared/constants";

// Init shared
const router = Router();
const iouDao = new IouDao();

/******************************************************************************
 *                      Get IOUs you are owed - "GET /api/iou/owed"
 ******************************************************************************/

router.get("/", async (req: Request, res: Response) => {
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  const iou = await iouDao.getOwed(username);
  if (!iou) {
    return res.status(401).json({
      error: paramMissingError,
    });
  }
  return res.status(OK).json({ iou });
});

/******************************************************************************
 *                      Create IOU you are owed - "POST /api/iou/owed"
 ******************************************************************************/

router.post("/", async (req: Request, res: Response) => {
  const { item, proof } = req.body;
  const giver = req.body.username;
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  const iou = await iouDao.postOwed(giver, username, item, proof);
  // TODO: handle 400 response
  if (!iou) {
    return res.status(401).json({
      error: paramMissingError,
    });
  }
  return res.status(OK).json({ iou });
});

/******************************************************************************
 *                       Mark an IOU as completed - "PUT /api/iou/owed/{iouID}/complete"
 ******************************************************************************/

router.put("/", async (req: Request, res: Response) => {
  const { iouID } = req.body;
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  // TODO: handle 400 responses
  if (!(await iouDao.completeOwed(username, iouID))) {
    return res.status(401).json({
      error: paramMissingError,
    });
  }
  return res.status(200).end();
});

/******************************************************************************
 *                      Get IOUs you owe - "GET /api/iou/owe"
 ******************************************************************************/

router.get("/", async (req: Request, res: Response) => {
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  const iou = await iouDao.getOwe(username);
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

router.post("/", async (req: Request, res: Response) => {
  const { item } = req.body;
  const receiver = req.body.username;
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  const iou = await iouDao.postOwe(username, receiver, item);
  // TODO: handle 400 response
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

router.put("/", async (req: Request, res: Response) => {
  const { iouID } = req.body;
  var tokens = req.cookies("access_tokens");
  var username = tokens.access_tokens.clientRefreshToken.username;
  // TODO: handle 400 responses
  if (!(await iouDao.completeOwed(username, iouID))) {
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
