import { DataTypes, Model } from "sequelize";
import db from "../daos/db-instance";

export interface IUser {
  username: string;
  display_name: string;
  password_hash: string;
}

class User extends Model<IUser> implements IUser {
  public username!: string;
  public display_name!: string;
  public password_hash!: string;
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, tableName: "users", timestamps: false }
);

export default User;