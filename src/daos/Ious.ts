import { DataTypes } from "sequelize";
import Iou, { IIouAttributes } from "../models/Iou";
import db from "./DBInstance";
import { getBasicUser, getUser } from "./Users";
import { getItem } from "./Items";
import User from "../models/User";
import Item from "src/models/Item";
import Offer from "src/models/Offer";

/*
 *  IOUs database table definition
 */

// ious table

Iou.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    item: {
      type: DataTypes.UUIDV4,
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
      type: DataTypes.UUIDV4,
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

// IOU foreign keys & relationships

const ItemForeignKey = {
  foreignKey: {
    name: "item",
    allowNull: false,
  },
};
Iou.belongsTo(Item, ItemForeignKey);
Item.hasMany(Iou, ItemForeignKey);

const GiverForeignKey = {
  foreignKey: {
    name: "giver",
    allowNull: false,
  },
};
Iou.belongsTo(User, GiverForeignKey);
User.hasMany(Iou, GiverForeignKey);

const ReceiverForeignKey = {
  foreignKey: {
    name: "receiver",
    allowNull: true,
  },
};
Iou.belongsTo(User, ReceiverForeignKey);
User.hasMany(Iou, ReceiverForeignKey);

const ParentOfferForeignKey = {
  foreignKey: {
    name: "parent_request",
    allowNull: true,
  },
};
Iou.belongsTo(Offer, ParentOfferForeignKey);
Offer.hasMany(Iou, ParentOfferForeignKey);

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
export async function getIous(filter: IIouFilter, start = 0, limit = 25) {
  return Iou.findAll({
    where: filter,
    offset: start,
    limit: 9999, // TODO limit,
  });
}

export async function getFormattedIous(
  filter?: IIouFilter,
  start = 0,
  limit = 25
) {
  const ious = await Iou.findAll({
    offset: start,
    limit: 9999, // TODO limit,
    subQuery: false,
    where: filter,
  });
  // detail user
  for (const iou of ious) {
    iou.item = (await getItem(iou.item as string)) as Object;
    iou.giver = (await getBasicUser(iou.giver as string)) ?? {};
    iou.receiver = (await getBasicUser(iou.receiver as string)) ?? undefined;
  }
  return ious;
}

export async function iouExists(iouID: string) {
  return (await Iou.findByPk(iouID)) ? true : false;
}

export async function completeIouOwed(iouID: string, receiver: string) {
  // user that completes must be receiver
  const iou = await Iou.findOne({ where: { id: iouID, receiver: receiver } });
  if (iou === null) {
    return false;
  } else {
    iou
      .update({
        claimed_time: new Date(),
        is_claimed: true,
      })
      .then(async () => await Iou.sync({ alter: true }));
  }
  return true;
}

export async function createIou(iou: IIouAttributes) {
  return Iou.create(iou);
}

export async function completeIouOwe(
  iouID: string,
  giver: string,
  proof: string
) {
  // user that completes must be receiver
  const iou = await Iou.findOne({ where: { id: iouID, giver: giver } });
  if (iou === null) {
    return false;
  } else {
    iou
      .update({
        claimed_time: new Date(),
        is_claimed: true,
        proof_of_completion: proof,
      })
      .then(async () => await Iou.sync({ alter: true }));
  }
  return true;
}

export async function updateIou(iou: Iou, attributes: IIouAttributes) {
  return iou.update(attributes);
}

export async function deleteIou(iou: Iou) {
  return iou.destroy();
}
