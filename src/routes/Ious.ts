import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import Joi, { ObjectSchema } from "joi";
import { getAuthenticatedUser } from "../shared/Authenticate";
import upload from "../shared/ImageHandler";
import { createIou, getIou, getIous, updateIou } from "../daos/Ious";
import { v4 as uuid } from "uuid";
import { partyDetection } from "../shared/PartyDetection";
import { getItem } from "../daos/Items";
import { getBasicUser } from "../daos/Users";
import { ConsoleTransportOptions } from "winston/lib/winston/transports";

// Init shared
const router = Router();

interface IIousQuery {
  start: number;
  limit: number;
}
const IousQuery: ObjectSchema<IIousQuery> = Joi.object({
  start: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1).max(100),
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
    const ious = await getIous(
      { receiver: user.username },
      iousQuery.start,
      iousQuery.limit
    );

    // Format IOUs according to API spec (item, giver, receiver as objects)
    let formattedIous = [];

    for (const iou of ious) {
      formattedIous.push({
        ...(iou as any).dataValues,
        item: await getItem(iou.item),
        giver: await getBasicUser(iou.giver),
        receiver: await getBasicUser(user.username),
      });
    }

    return res.status(OK).json(formattedIous);
  } else {
    return res.status(401).json({
      errors: ["Not authenticated"],
    });
  }
});

/**
 * POST: /api/iou/owed (Create IOU you are owed)
 */

interface IIouOwedPOST {
  username: string;
  item: string;
  proof: string;
}
const IouOwedPOST: ObjectSchema<IIouOwedPOST> = Joi.object({
  username: Joi.string(),
  item: Joi.string(),
}).options({ presence: "required" });

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
      const iou = await createIou({
        id: uuid(),
        giver: requestBody.username,
        receiver: user.username,
        item: requestBody.item,
        proof_of_debt: req.file.filename,
        created_time: new Date(),
        is_claimed: false,
      });

      // Party detection
      let party;
      const partyResults = await partyDetection(iou);
      if (partyResults) {
        party = partyResults;
      }

      return res.status(OK).json({ id: iou.id, usersInParty: party });
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

    const iou = await getIou(iouID);

    // If IOU exists, you are the receiver and it is not yet claimed
    if (iou && iou.receiver == user.username && !iou.is_claimed) {
      await updateIou(iou, {
        ...iou,
        claimed_time: new Date(),
        is_claimed: true,
      });
      return res.status(OK).end();
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

interface IIouOwePOST {
  username: string;
  item: string;
}
const IouOwePOST: ObjectSchema<IIouOwePOST> = Joi.object({
  username: Joi.string(),
  item: Joi.string(),
}).options({ presence: "required" });

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
    const ious = await getIous(
      { giver: user.username },
      iousQuery.start,
      iousQuery.limit
    );

    // Format IOUs according to API spec (item, giver, receiver as objects)
    let formattedIous = [];

    for (const iou of ious) {
      formattedIous.push({
        ...(iou as any).dataValues,
        item: await getItem(iou.item),
        giver: await getBasicUser(iou.giver),
        receiver: iou.receiver ? await getBasicUser(iou.receiver) : undefined,
      });
    }

    return res.status(OK).json(formattedIous);
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
    const iou = await createIou({
      id: uuid(),
      giver: user.username,
      receiver: requestBody.username,
      item: requestBody.item,
      created_time: new Date(),
      is_claimed: false,
    });

    // Party detection
    let party;
    const partyResults = await partyDetection(iou);
    if (partyResults) {
      party = partyResults;
    }

    return res.status(OK).json({ id: iou.id, usersInParty: party });
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

      const iou = await getIou(iouID);

      // if IOU exists, you are the giver and it is not already complete
      if (iou && iou.giver == user.username && !iou.is_claimed) {
        await updateIou(iou, {
          ...iou,
          claimed_time: new Date(),
          is_claimed: true,
          proof_of_completion: req.file.filename,
        });

        return res.status(OK).end();
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
