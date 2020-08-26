import { DataTypes, Model } from "sequelize";
import db from "../DBInstance";

interface IUserAttributes {
  username: string;
  display_name: string;
  password_hash: string;
}

class User extends Model<IUserAttributes> implements IUserAttributes {
  public username!: string;
  public display_name!: string;
  public password_hash!: string;
}

User.init(
  {
    username: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
  },
  { sequelize: db, tableName: "users" }
);
