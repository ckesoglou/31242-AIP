import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";

import ImageDao from "../daos/Image/ImageDao";
import { paramMissingError } from "@shared/constants";
import { stringify } from "querystring";

// Init shared
const router = Router();
const imageDao = new ImageDao();

/******************************************************************************
 *                      Get One Image - "GET /api/images/"
 ******************************************************************************/

router.get("/test", async (req: Request, res: Response) => {
  const images = await imageDao.getOne();
  if (images) {
    var blob = images[0].getDataValue("blob");
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(blob));
  }
});

export default router;
