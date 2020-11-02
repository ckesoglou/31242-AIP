import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import Joi, { ObjectSchema } from "joi";
import { getAuthenticatedUser } from "@shared/Authenticate";
import upload from "../shared/ImageHandler";
import {
  createIouOwed,
  completeIouOwed,
  createIouOwe,
  completeIouOwe,
  iouExists,
  getFormattedIous,
  partyDetection,
} from "@daos/Ious";
import Iou from "@entities/Iou";

// Init shared
const router = Router();

interface IIouOwedPOST {
  username: string;
  item: string;
  proof: string;
}
interface IIouOwePOST {
  username: string;
  item: string;
}
const IouOwedPOST: ObjectSchema<IIouOwedPOST> = Joi.object({
  username: Joi.string(),
  item: Joi.string(),
}).options({ presence: "required" });
const IouOwePOST: ObjectSchema<IIouOwePOST> = Joi.object({
  username: Joi.string(),
  item: Joi.string(),
}).options({ presence: "required" });
interface IIousQuery {
  start: number;
  limit: number;
}
const IousQuery: ObjectSchema<IIousQuery> = Joi.object({
  start: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(25),
});

/**
 * GET: /api/iou/owed (Get IOUs you are owed)
 */

router.get("/owed", async (req: Request, res: Response) => {
  // Validate request format
  const { error, value } = IousQuery.validate(req.query);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }
  const iousQuery = value as IIousQuery;
  // Get authenticated user
  const user = await getAuthenticatedUser(req, res);
  if (user) {
    // Get IOUs
    const iou = await getFormattedIous(
      { receiver: user.username },
      iousQuery.start,
      iousQuery.limit
    );
    return res.status(OK).json(iou);
  } else {
    return res.status(401).json({
      errors: ["Not authenticated"],
    });
  }
});

/**
 * POST: /api/iou/owed (Create IOU you are owed)
 */

router.post(
  "/owed",
  upload.single("proof"),
  async (req: Request, res: Response) => {
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
        req.file.filename
      );
      const newIou = await Iou.findByPk(iou);

      // Party detection
      var party;
      if (newIou) {
        var partyResults = await partyDetection(newIou);
        if (partyResults) {
          party = partyResults;
        }
      }

      return res.status(OK).json({ id: iou, usersInParty: party });
    } else {
      return res.status(401).json({
        errors: ["Not authenticated"],
      });
    }
  }
);

/**
 * PUT: /api/iou/owed/{iouID}/complete (Mark an IOU as completed)
 */

router.put("/owed/:iouID/complete", async (req: Request, res: Response) => {
  // Get authenticated user
  const user = await getAuthenticatedUser(req, res);
  // If logged in
  if (user) {
    const iouID = req.params.iouID;
    // If IOU exists
    if (await iouExists(iouID)) {
      // If user is receiver of IOU
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

/**
 * GET: /api/iou/owe (Get IOUs you owe)
 */

router.get("/owe", async (req: Request, res: Response) => {
  // Validate request format
  const { error, value } = IousQuery.validate(req.query);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }
  const iousQuery = value as IIousQuery;
  // Get authenticated user
  const user = await getAuthenticatedUser(req, res);
  if (user) {
    // Get IOUs
    const iou = await getFormattedIous(
      { giver: user.username },
      iousQuery.start,
      iousQuery.limit
    );
    return res.status(OK).json(iou);
  } else {
    return res.status(401).json({
      errors: ["Not authenticated"],
    });
  }
});

/**
 * POST: /api/iou/owe (Create IOU you owe)
 */

router.post("/owe", async (req: Request, res: Response) => {
  // Validate request format
  const { error, value } = IouOwePOST.validate(req.body);
  if (error) {
    return res.status(BAD_REQUEST).json({
      error: [error.message],
    });
  }
  // Get authenticated user
  const user = await getAuthenticatedUser(req, res);
  if (user) {
    // Create new IOU
    const requestBody = value as IIouOwePOST;
    const iou = await createIouOwe(
      user.username,
      requestBody.username,
      requestBody.item
    );
    const newIou = await Iou.findByPk(iou);

    // Party detection
    var party;
    if (newIou) {
      var partyResults = await partyDetection(newIou);
      if (partyResults) {
        party = partyResults;
      }
    }

    return res.status(OK).json({ id: iou, usersInParty: party });
  } else {
    return res.status(401).json({
      errors: ["Not authenticated"],
    });
  }
});

/**
 * PUT: /api/iou/owe/{iouID}/complete (Mark an IOU as completed)
 */

router.put(
  "/owe/:iouID/complete",
  upload.single("proof"),
  async (req: Request, res: Response) => {
    // Get authenticated user
    const user = await getAuthenticatedUser(req, res);
    // if logged in
    if (user) {
      const iouID = req.params.iouID;
      // if IOU exists
      if (await iouExists(iouID)) {
        // if users is receiver of IOU
        if (
          (await completeIouOwe(iouID, user.username, req.file.filename)) ==
          true
        ) {
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
          errors: ["Not found (did you mean to use the /owed endpoint)"],
        });
      }
    } else {
      return res.status(401).json({
        errors: ["Not authenticated"],
      });
    }
  }
);

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
