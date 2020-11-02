import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "http-status-codes";
import {
  createOffer,
  deleteOffer,
  getOffer,
  getOffers,
  updateOffer,
} from "../daos/Offers";
import { Request, Response, Router } from "express";
import { getBasicUser } from "../daos/Users";
import Joi, { ObjectSchema } from "joi";
import { v4 as uuid } from "uuid";
import { createIou, deleteIou, getIou, getIous, updateIou } from "../daos/Ious";
import { Op } from "sequelize";
import Offer from "../models/Offer";
import { getAuthenticatedUser } from "../shared/Authenticate";
import { getItem } from "../daos/Items";
import upload from "../shared/ImageHandler";

const router = Router();

async function formatRequest(request: Offer) {
  const ious = await getIous({ parent_offer: request.id }, 0, 9999);
  // Combine reward objects with IOU response
  const rewards = [];
  for (const iou of ious) {
    rewards.push({
      id: iou.id,
      item: await getItem(iou.item as string),
      giver: await getBasicUser(iou.giver as string),
    });
  }

  return {
    ...(request as any).dataValues,
    author: await getBasicUser(request.author),
    completed_by: await getBasicUser(request.completed_by),
    rewards: rewards,
  };
}

/**
 * GET: /requests
 */

interface IRequestsQuery {
  start?: number;
  limit?: number;
  author?: string;
  search?: string;
  reward?: string;
}

const RequestsQuery: ObjectSchema<IRequestsQuery> = Joi.object({
  start: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1).max(100),
  author: Joi.string().alphanum().min(2).max(16, "utf8"),
  search: Joi.string().max(50, "utf8"),
  reward: Joi.string().guid({ version: "uuidv4" }),
}).oxor("author", "search", "reward"); // author, search and reward are mutually exclusive

router.get("/requests", async (req: Request, res: Response) => {
  // Validate request
  const { error, value } = RequestsQuery.validate(req.query);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  const requestQuery = value as IRequestsQuery;

  let matchedRequests: Offer[] = [];

  if (requestQuery.author) {
    // Search by author
    matchedRequests = await getOffers(
      { author: requestQuery.author },
      requestQuery.start,
      requestQuery.limit
    );
  } else if (requestQuery.search) {
    // Search by keyword (details)
    matchedRequests = await getOffers(
      { details: { [Op.substring]: requestQuery.search } },
      requestQuery.start,
      requestQuery.limit
    );
  } else if (requestQuery.reward) {
    // Search by reward item
    const matchedIous = await getIous(
      { item: requestQuery.reward },
      requestQuery.start,
      requestQuery.limit
    );
    for (const iou of matchedIous) {
      const parentRequest = await getOffer(iou.parent_offer);
      if (parentRequest) {
        matchedRequests.push(parentRequest);
      }
    }
  } else {
    // No search - return all offers
    matchedRequests = await getOffers(
      {},
      requestQuery.start,
      requestQuery.limit
    );
  }

  const requestResponse: any[] = [];

  for (const request of matchedRequests) {
    requestResponse.push(await formatRequest(request));
  }

  return res.status(OK).json(requestResponse).end();
});

/**
 * POST: /requests
 */

interface IRequestsPostBody {
  details: string;
  item: string;
}

const RequestsPostBody: ObjectSchema<IRequestsPostBody> = Joi.object({
  details: Joi.string().min(2).max(50, "utf8"),
  item: Joi.string().guid({ version: "uuidv4" }),
}).options({ presence: "required" });

router.post("/requests", async (req: Request, res: Response) => {
  // Validate request
  const { error, value } = RequestsPostBody.validate(req.body);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }
  // Get authenticated user
  const user = await getAuthenticatedUser(req, res);
  if (!user) {
    return res.status(UNAUTHORIZED).json({
      errors: ["Not authenticated."],
    });
  }

  const requestBody = value as IRequestsPostBody;

  const reward = await getItem(requestBody.item);
  if (!reward) {
    return res
      .status(BAD_REQUEST)
      .json({
        errors: ["Provided GUID does not match to any available item."],
      })
      .end();
  }
  const request = await createOffer({
    id: uuid(),
    author: user.username,
    details: requestBody.details,
    created_time: new Date(),
    is_completed: false,
  });
  // Create reward
  await createIou({
    id: uuid(),
    item: reward.id,
    giver: user.username,
    parent_offer: request.id,
    created_time: new Date(),
    is_claimed: false,
  });

  return res.status(CREATED).json({ id: request.id }).end();
});

/**
 * GET: /request/{requestId}
 */

interface IRequestParams {
  requestID: string;
}

const RequestParams: ObjectSchema<IRequestParams> = Joi.object({
  requestID: Joi.string().guid({ version: "uuidv4" }).required(),
});

router.get("/request/:requestID", async (req: Request, res: Response) => {
  // Validate request
  const { error, value } = RequestParams.validate(req.params);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  const requestParams = value as IRequestParams;

  const request = await getOffer(requestParams.requestID);

  return request
    ? res
        .status(OK)
        .json(await formatRequest(request))
        .end()
    : res.status(NOT_FOUND).end();
});

/**
 * DELETE: /request/{requestId}
 */

router.delete("/request/:requestID", async (req: Request, res: Response) => {
  // Validate request
  const { error, value } = RequestParams.validate(req.params);
  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  const requestParams = value as IRequestParams;

  const user = await getAuthenticatedUser(req, res);
  if (!user) {
    return res.status(UNAUTHORIZED).json({
      errors: ["Not authenticated."],
    });
  }

  const request = await getOffer(requestParams.requestID);
  if (!request) {
    return res.status(NOT_FOUND).end();
  }
  // Check if request can be deleted by authenticated user
  if (request.is_completed || request.author != user.username) {
    return res.status(FORBIDDEN).json({
      errors: [
        "Not authorised to delete this request (you are not the author of it, or it has already been completed).",
      ],
    });
  }
  // Remove rewards/IOUs associated with request
  const rewards = await getIous({ parent_offer: request.id });
  for (const iou of rewards) {
    await deleteIou(iou);
  }

  await deleteOffer(request);

  return res.status(OK).end();
});

/**
 * PUT: /request/{requestId}/complete
 */
router.put(
  "/request/:requestID/complete",
  upload.single("proof"),
  async (req: Request, res: Response) => {
    // Validate request
    const { error, value } = RequestParams.validate(req.params);
    if (error || !req.file) {
      return res.status(BAD_REQUEST).json({
        errors: [
          error?.message ??
            "Image was not provided or is too large (only png or jpeg up to 5 MB).",
        ],
      });
    }

    const requestParams = value as IRequestParams;

    const user = await getAuthenticatedUser(req, res);
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        errors: ["Not authenticated."],
      });
    }

    const request = await getOffer(requestParams.requestID);
    if (!request) {
      return res.status(NOT_FOUND).end();
    }
    // Check if users is authorised to complete request
    if (request.author == user.username) {
      return res
        .status(FORBIDDEN)
        .json({
          errors: [
            "Not authorised to complete this request (you are the owner of it or the only one offering rewards).",
          ],
        })
        .end();
    }
    if (request.is_completed) {
      return res
        .status(FORBIDDEN)
        .json({
          errors: [
            "Not authorised to complete this request (it is already completed).",
          ],
        })
        .end();
    }
    const rewards = await getIous({ parent_offer: request.id });
    const rewardsYouAreOffering = await getIous({
      parent_offer: request.id,
      giver: user.username,
    });
    if (rewardsYouAreOffering.length == rewards.length) {
      return res
        .status(FORBIDDEN)
        .json({
          errors: [
            "Not authorised to complete this request (you are the owner of it or the only one offering rewards).",
          ],
        })
        .end();
    }
    // Update reward/IOU receiver
    for (const iou of rewards) {
      if (iou.receiver == user.username) {
        await deleteIou(iou);
      } else {
        await updateIou(iou, {
          ...(iou as any).dataValues,
          receiver: user.username,
          proof_of_debt: req.file.filename,
        });
      }
    }

    await updateOffer(request, {
      ...(request as any).dataValues,
      completed_by: user.username,
      is_completed: true,
      completion_time: new Date(),
      proof_of_completion: req.file.filename,
    });

    return res.status(OK).end();
  }
);

/**
 * GET: /request/{requestId}/rewards
 */

router.get(
  "/request/:requestID/rewards",
  async (req: Request, res: Response) => {
    // Validate request
    const { error, value } = RequestParams.validate(req.params);
    if (error) {
      return res.status(BAD_REQUEST).json({
        errors: [error.message],
      });
    }

    const requestParams = value as IRequestParams;

    const request = await getOffer(requestParams.requestID);
    if (!request) {
      return res.status(NOT_FOUND).end();
    }
    // Get rewards associated with request
    const ious = await getIous({ parent_offer: request.id });
    const rewards = [];
    for (const iou of ious) {
      rewards.push({
        id: iou.id,
        giver: await getBasicUser(iou.giver as string),
        item: await getItem(iou.item as string),
      });
    }

    return res.status(OK).json(rewards).end();
  }
);

/**
 * POST: /request/{requestId}/rewards
 */

interface IRequestRewardsBody {
  item: string;
}

const RequestRewardsBody: ObjectSchema<IRequestRewardsBody> = Joi.object({
  item: Joi.string().guid({ version: "uuidv4" }).required(),
});

router.post(
  "/request/:requestID/rewards",
  async (req: Request, res: Response) => {
    // Validate request
    var { error, value } = RequestParams.validate(req.params);
    if (error) {
      return res.status(BAD_REQUEST).json({
        errors: [error.message],
      });
    }

    const requestParams = value as IRequestParams;

    var { error, value } = RequestRewardsBody.validate(req.body);
    if (error) {
      return res.status(BAD_REQUEST).json({
        errors: [error.message],
      });
    }

    const requestBody = value as IRequestRewardsBody;

    const user = await getAuthenticatedUser(req, res);
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        errors: ["Not authenticated."],
      });
    }

    const request = await getOffer(requestParams.requestID);
    const item = await getItem(requestBody.item);
    if (!request || !item) {
      return res.status(NOT_FOUND).end();
    }
    // Add new reward/IOU associated with request
    const iou = await createIou({
      id: uuid(),
      item: requestBody.item,
      giver: user.username,
      parent_offer: request.id,
      created_time: new Date(),
      is_claimed: false,
    });

    return res.status(OK).json({ id: iou.id }).end();
  }
);

/**
 * GET: /request/{requestId}/reward/{rewardId}
 */

interface IRequestRewardParams extends IRequestParams {
  rewardID: string;
}

const RequestRewardParams: ObjectSchema<IRequestRewardParams> = Joi.object({
  requestID: Joi.string().guid({ version: "uuidv4" }).required(),
  rewardID: Joi.string().guid({ version: "uuidv4" }).required(),
});

router.get(
  "/request/:requestID/reward/:rewardID",
  async (req: Request, res: Response) => {
    // Validate request
    const { error, value } = RequestRewardParams.validate(req.params);
    if (error) {
      return res.status(BAD_REQUEST).json({
        errors: [error.message],
      });
    }

    const requestParams = value as IRequestRewardParams;

    const iou = await getIou(requestParams.rewardID);
    if (iou == null || iou.parent_offer != requestParams.requestID) {
      return res.status(NOT_FOUND).end();
    }
    // Format response
    const reward = {
      id: iou.id,
      giver: await getBasicUser(iou.giver as string),
      item: await getItem(iou.item as string),
    };

    return res.status(OK).json(reward).end();
  }
);

/**
 * DELETE: /request/{requestId}/reward/{rewardId}
 */

router.delete(
  "/request/:requestID/reward/:rewardID",
  async (req: Request, res: Response) => {
    // Validate request
    const { error, value } = RequestRewardParams.validate(req.params);
    if (error) {
      return res.status(BAD_REQUEST).json({
        errors: [error.message],
      });
    }

    const requestParams = value as IRequestRewardParams;

    const user = await getAuthenticatedUser(req, res);
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        errors: ["Not authenticated."],
      });
    }
    // Get reward and request object
    const iou = await getIou(requestParams.rewardID);
    const request = await getOffer(requestParams.requestID);
    if (!iou || !request || iou.parent_offer != requestParams.requestID) {
      return res.status(NOT_FOUND).end();
    }
    // Check if user is authorised to remove reward
    if (request.is_completed || iou.giver != user.username) {
      return res.status(FORBIDDEN).json({
        errors: [
          "Not authorised to delete this reward (you are not the one offering it, or the request is already complete).",
        ],
      });
    }
    // Delete reward/IOU
    await deleteIou(iou);

    const remainingRewards = await getIous({ parent_offer: request.id });
    if (remainingRewards.length === 0) {
      await deleteOffer(request);
    }

    return res.status(OK).end();
  }
);

export default router;
