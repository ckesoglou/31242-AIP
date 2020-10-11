import { DataTypes } from "sequelize";
import Iou, { IIouAttributes } from "../entities/Iou";
import db from "./DBInstance";
import { v4 as uuid } from "uuid";

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

export async function createIouOwed(
  giver: string,
  receiver: string,
  item: string,
  proof: string
): Promise<Object> {
  const ious = await Iou.create({
    id: uuid(),
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

export async function iouExists(iouID: string): Promise<boolean> {
  return (await Iou.findByPk(iouID)) ? true : false;
}

export async function completeIouOwed(
  iouID: string,
  receiver: string
): Promise<boolean> {
  // user that completes must be receiver
  const iou = await Iou.findOne({ where: { id: iouID, receiver: receiver } });
  if (iou === null) {
    return false;
  } else {
    iou
      .update({
        is_claimed: true,
      })
      .then(async () => await Iou.sync({ alter: true }));
  }
  return true;
}

export async function getIousOwe(
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

export async function createIouOwe(
  giver: string,
  receiver: string,
  item: string
): Promise<Object> {
  const ious = await Iou.create({
    id: uuid(),
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

export async function completeIouOwe(
  iouID: string,
  giver: string,
  proof: string
): Promise<boolean> {
  // user that completes must be receiver
  const iou = await Iou.findOne({ where: { id: iouID, giver: giver } });
  if (iou === null) {
    return false;
  } else {
    iou
      .update({
        is_claimed: true,
        proof_of_completion: proof,
      })
      .then(async () => await Iou.sync({ alter: true }));
  }
  return true;
}
