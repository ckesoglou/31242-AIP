import { DataTypes, Model } from "sequelize";
import db from "../daos/DBInstance";

interface IImageAttributes {
  id: string;
  blob: string;
}

class Image extends Model<IImageAttributes> implements IImageAttributes {
  public id!: string;
  public blob!: string;
}

Image.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    blob: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  { sequelize: db, tableName: "images" }
);

export default Image;
