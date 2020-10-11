import { Model } from "sequelize";

export interface IIouAttributes {
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

class Iou extends Model<IIouAttributes> implements IIouAttributes {
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

export default Iou;
