import { DataTypes, Model } from "sequelize";
import db from "../daos/DBInstance";

export interface IIou {
  id: string;
  item: string;
  giver: string;
  receiver?: string;
  parent_request?: string;
  proof_of_debt?: string;
  proof_of_completion?: string;
  created_time: Date;
  claimed_time?: Date;
  is_claimed: Boolean;
}

class Iou extends Model<IIou> implements IIou {
  public id!: string;
  public item!: string;
  public giver!: string;
  public receiver: string | undefined;
  public parent_request!: string;
  public proof_of_debt: string | undefined;
  public proof_of_completion: string | undefined;
  public created_time!: Date;
  public claimed_time: Date | undefined;
  public is_claimed!: Boolean;
}

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
  { sequelize: db, tableName: "iou" }
);

export default Iou;
