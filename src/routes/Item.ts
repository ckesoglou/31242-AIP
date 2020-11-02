import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import { createItem, getItems } from "../daos/Items";
import { v4 as uuid } from "uuid";
import env from "../Environment";

const router = Router();

/**
 * GET: /items
 */

router.get("/items", async (req: Request, res: Response) => {
  const items = await getItems();
  return res.status(OK).json(items).end();
});

/**
 * POST: /item (DEVELOPMENT BUILD ONLY)
 */
if (env.node_env === "development") {
  router.get("/items/populate", async (req: Request, res: Response) => {
    // Useful endpoint to hit manually when testing with an inmemory database
    const existingItems = await getItems();
    if (existingItems.length) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: ["items table is already populated"] })
        .end();
    } else {
      await createItem({ id: uuid(), display_name: "Coffee" });
      await createItem({ id: uuid(), display_name: "Lunch" });
      await createItem({ id: uuid(), display_name: "Kiss" });

      return res.status(OK).json("Populated database with sample items").end();
    }
  });
}

export default router;
