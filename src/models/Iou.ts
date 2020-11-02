import { Model } from "sequelize";

export interface IIouAttributes {
  id: string;
  item: Object;
  giver: Object;
  receiver?: Object;
  parent_offer?: string;
  proof_of_debt?: string;
  proof_of_completion?: string;
  created_time: Date;
  claimed_time?: Date;
  is_claimed: boolean;
}

class Iou extends Model<IIouAttributes> implements IIouAttributes {
  public id!: string;
  public item!: Object;
  public giver!: Object;
  public receiver: Object | undefined;
  public parent_offer!: string;
  public proof_of_debt: string | undefined;
  public proof_of_completion: string | undefined;
  public created_time!: Date;
  public claimed_time: Date | undefined;
  public is_claimed!: boolean;
}

export default Iou;
