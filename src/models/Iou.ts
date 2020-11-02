import { Model } from "sequelize";
import Item from "./Item";
import Offer from "./Offer";
import User from "./User";

// Class definition

export interface IIouAttributes {
  id: string;
  item: string;
  giver: string;
  receiver?: string;
  parent_offer?: string;
  proof_of_debt?: string;
  proof_of_completion?: string;
  created_time: Date;
  claimed_time?: Date;
  is_claimed: boolean;
}

class Iou extends Model<IIouAttributes> implements IIouAttributes {
  public id!: string;
  public item!: string;
  public giver!: string;
  public receiver: string | undefined;
  public parent_offer!: string;
  public proof_of_debt: string | undefined;
  public proof_of_completion: string | undefined;
  public created_time!: Date;
  public claimed_time: Date | undefined;
  public is_claimed!: boolean;
}

// IOU relationships

export async function initialiseIouRelationships() {
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
      name: "parent_offer",
      allowNull: true,
    },
  };
  Iou.belongsTo(Offer, ParentOfferForeignKey);
  Offer.hasMany(Iou, ParentOfferForeignKey);
}

export default Iou;
