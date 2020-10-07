import Iou, { IIou } from "@entities/Iou";
import db from "../db-instance";
import { setFlagsFromString } from "v8";
import sequelize from "../db-instance";

export interface IIouDao {
  getOwed: (
    username: string,
    start?: number,
    limit?: number
  ) => Promise<IIou[]>;
  postOwed: (
    giver: string,
    receiver: string,
    item: string,
    proof: string
  ) => Promise<Object>;
  completeOwed: (username: string, iouname: string) => Promise<null>;
}

class IouDao implements IIouDao {
  public async getOwed(
    username: string,
    start: number = 0,
    limit: number = 25
  ): Promise<IIou[]> {
    const ious = await Iou.findAll({
      offset: start,
      limit: limit,
      subQuery: false,
      where: {
        receiver: username,
        is_claimed: false,
      },
    });
    return ious;
  }

  public async postOwed(
    giver: string,
    receiver: string,
    item: string,
    proof: string
  ): Promise<Object> {
    const ious = await Iou.create({
      id: "510ab12d-1689-4b2c-8a8d-275376f11077", // TODO: autogenerate id
      item: item,
      giver: giver,
      receiver: receiver,
      parent_request: undefined,
      proof_of_debt: proof,
      proof_of_completion: undefined,
      created_time: new Date(),
      claimed_time: undefined,
      is_claimed: false,
    });
    return ious.id;
  }

  public async completeOwed(receiver: string, iouID: string) {
    Iou.findOne({ where: { id: iouID, receiver: receiver } }).then(function (
      iou
    ) {
      if (iou) {
        iou
          .update({
            is_claimed: true,
          })
          .then(async function () {
            await Iou.sync({ alter: true });
          });
      }
    });
    return null;
  }

  public async getOwe(
    username: string,
    start: number = 0,
    limit: number = 25
  ): Promise<IIou[]> {
    const ious = await Iou.findAll({
      offset: start,
      limit: limit,
      subQuery: false,
      where: {
        giver: username,
        is_claimed: false,
      },
    });
    return ious;
  }

  public async postOwe(
    giver: string,
    receiver: string,
    item: string
  ): Promise<Object> {
    const ious = await Iou.create({
      id: "510ab12d-1689-4b2c-8a8d-275376f11077", // TODO: autogenerate id
      item: item,
      giver: giver,
      receiver: receiver,
      parent_request: undefined,
      proof_of_debt: undefined,
      proof_of_completion: undefined,
      created_time: new Date(),
      claimed_time: undefined,
      is_claimed: false,
    });
    return ious.id;
  }

  public async completeOwe(giver: string, iouID: string) {
    Iou.findOne({ where: { id: iouID, giver: giver } }).then(function (iou) {
      if (iou) {
        iou
          .update({
            is_claimed: true,
          })
          .then(async function () {
            await Iou.sync({ alter: true });
          });
      }
    });
    return null;
  }
}

export default IouDao;
