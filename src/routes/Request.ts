import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "http-status-codes";
import { getBasicUser } from "../daos/Users";
import Joi, { ObjectSchema } from "joi";
import { v4 as uuid } from "uuid";
import { createRequest, deleteRequest, getRequest, getRequests } from "@daos/IouRequests";
import { createIou, createIouOwe, getIous } from "@daos/Ious";
import { Op } from "sequelize";
import IouRequest from '@entities/IouRequest';
import { getAuthenticatedUser } from '@shared/Authenticate';
import { getItem } from '@daos/Items';

const router = Router();

async function formatRequest(request: IouRequest) {
  const ious = await getIous({ parent_request: request.id }, 0, 9999);
  const rewardItems = ious.map(iou => { return iou.item });

  return {
    ...(request as any).dataValues,
    author: await getBasicUser(request.author),
    completed_by: await getBasicUser(request.completed_by),
    rewards: rewardItems
  }
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
  start: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(25),
  author: Joi.string().alphanum().min(2).max(16, "utf8"),
  search: Joi.string().max(50, "utf8"),
  reward: Joi.string().guid({ version: "uuidv4" }),
}).oxor("author", "search", "reward"); // author, search and reward are mutually exclusive

router.get("/requests", async (req: Request, res: Response) => {
  const { error, value } = RequestsQuery.validate(req.query);

  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  let requestQuery = value as IRequestsQuery;

  let matchedRequests: IouRequest[] = [];

  if (requestQuery.author) {
    matchedRequests = await getRequests({ author: requestQuery.author }, requestQuery.start, requestQuery.limit);
  }
  else if (requestQuery.search) {
    matchedRequests = await getRequests({ details: { [Op.substring]: requestQuery.search } }, requestQuery.start, requestQuery.limit);
  }
  else if (requestQuery.reward) {
    const matchedIous = await getIous({ item: requestQuery.reward }, requestQuery.start, requestQuery.limit);
    for (const iou of matchedIous) {
      const parentRequest = await getRequest(iou.parent_request);
      if (parentRequest) {
        matchedRequests.push(parentRequest)
      }
    }
  }
  else {
    matchedRequests = await getRequests({}, requestQuery.start, requestQuery.limit);
  }

  let requestResponse: any[] = [];

  for (const request of matchedRequests) {
    requestResponse.push(await formatRequest(request))
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
  const { error, value } = RequestsPostBody.validate(req.body);

  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  const user = await getAuthenticatedUser(req, res);
  if (!user) {
    return res.status(UNAUTHORIZED).json({
      errors: ["Not authenticated."],
    });
  }

  let requestBody = value as IRequestsPostBody;

  const reward = await getItem(requestBody.item);
  if (!reward) {
    return res.status(BAD_REQUEST).json({
      errors: [ "Provided GUID does not match to any available item." ],
    }).end();
  }
  const request = await createRequest(uuid(), user.username, requestBody.details, new Date());
  await createIou({
    id: uuid(),
    item: reward.id,
    giver: user.username,
    parent_request: request.id,
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
})

router.get("/request/:requestID", async (req: Request, res: Response) => {
  const { error, value } = RequestParams.validate(req.params);

  if (error) {
    return res.status(BAD_REQUEST).json({
      errors: [error.message],
    });
  }

  let requestParams = value as IRequestParams;

  const request = await getRequest(requestParams.requestID);

  return request ? res.status(OK).json(request).end() : res.status(404).end();
});

export default router;
