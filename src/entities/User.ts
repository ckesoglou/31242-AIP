import { DataTypes, Model } from "sequelize";
import db from "../daos/db-instance";

export interface IUser {
  username: string;
  displayName: string;
  password: string;
}

class User extends Model<IUser> implements IUser {
  public username!: string;
  public displayName!: string;
  public password!: string;
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, tableName: "users" }
);

export default User;