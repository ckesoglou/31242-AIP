import { DataTypes } from "sequelize";
import Iou, { IIouAttributes } from "../models/Iou";
import db from "./DBInstance";

/*
 *  IOUs database table definition
 */

Iou.init(
  {
    id: {
      type: "UNIQUEIDENTIFIER",
      primaryKey: true,
      allowNull: false,
    },
    item: {
      type: "UNIQUEIDENTIFIER",
      allowNull: false,
    },
    giver: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    receiver: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    parent_offer: {
      type: "UNIQUEIDENTIFIER",
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
      defaultValue: false,
    },
  },
  { sequelize: db, tableName: "ious", timestamps: false }
);

/*
 *  IOU CRUD operations
 */

export interface IIouFilter {
  giver?: string;
  receiver?: string;
  parent_offer?: string;
  is_claimed?: boolean;
  item?: string;
}

export async function getIou(pk: string) {
  return Iou.findByPk(pk);
}
export async function getIous(
  filter: IIouFilter,
  start: number | undefined = undefined,
  limit: number | undefined = undefined
) {
  return Iou.findAll({
    where: filter,
    offset: start,
    limit: limit,
  });
}

export async function createIou(iou: IIouAttributes) {
  return Iou.create(iou);
}

export async function updateIou(iou: Iou, attributes: IIouAttributes) {
  return iou.update(attributes);
}

export async function deleteIou(iou: Iou) {
  return iou.destroy();
}

export async function deleteAllIous() {
  return Iou.destroy({ truncate: true });
}
