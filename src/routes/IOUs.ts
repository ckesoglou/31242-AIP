import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";

// import IouDao from "@daos/iou/iou-dao";
import { paramMissingError } from "@shared/constants";

// Init shared
const router = Router();
const iouDao = new IouDao();

/******************************************************************************
 *                      Get owed IOIs - "GET /api/iou/owed"
 ******************************************************************************/

router.get("/owed", async (req: Request, res: Response) => {
  const ious = await iouDao.getAll();
  return res.status(OK).json({ ious });
});

/******************************************************************************
 *                       Add One - "POST /api/ious/add"
 ******************************************************************************/

router.post("/add", async (req: Request, res: Response) => {
  const { iou } = req.body;
  if (!iou) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await iouDao.add(iou);
  return res.status(CREATED).end();
});

/******************************************************************************
 *                       Update - "PUT /api/ious/update"
 ******************************************************************************/

router.put("/update", async (req: Request, res: Response) => {
  const { iou } = req.body;
  if (!iou) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  iou.iouname = String(iou.iouname);
  await iouDao.update(iou);
  return res.status(OK).end();
});

/******************************************************************************
 *                    Delete - "DELETE /api/ious/delete/:id"
 ******************************************************************************/

router.delete("/delete/:id", async (req: Request, res: Response) => {
  const { iouname } = req.params as ParamsDictionary;
  await iouDao.delete(iouname);
  return res.status(OK).end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
