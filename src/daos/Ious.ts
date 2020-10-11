import { DataTypes } from "sequelize";
import Iou, { IIouAttributes } from "../entities/Iou";
import db from "./DBInstance";

Iou.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    giver: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiver: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parent_request: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    proof_of_debt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    proof_of_completion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    claimed_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_claimed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { sequelize: db, tableName: "ious", timestamps: false }
);

export async function getIousOwed(
  username: string,
  start: number = 0,
  limit: number = 25
): Promise<IIouAttributes[]> {
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

export async function postOwed(
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

export async function completeOwed(receiver: string, iouID: string) {
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

export async function getOwe(
  username: string,
  start: number = 0,
  limit: number = 25
): Promise<IIouAttributes[]> {
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

export async function postOwe(
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

export async function completeOwe(giver: string, iouID: string) {
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
