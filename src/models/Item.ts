import { Model } from "sequelize";

// Class definition

export interface IItemAttributes {
  id: string;
  display_name: string;
}

class Item extends Model<IItemAttributes> implements IItemAttributes {
  public id!: string;
  public display_name!: string;
}

export default Item;
