import { Request, Response, Router } from "express";
import { OK } from "http-status-codes";
import { getItems } from '@daos/Items';

const router = Router();

/**
 * GET: /items
 */


router.get("/items", async (req: Request, res: Response) => {
  const items = await getItems();

  return res.status(OK).json(items).end();
});

export default router;
