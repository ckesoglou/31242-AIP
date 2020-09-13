import { DataTypes } from "sequelize";
import User from "../entities/User";
import db from "./DBInstance";
import bcrypt from "bcrypt";

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
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
  },
  { sequelize: db, tableName: "users" }
);

export async function getUser(username: string) {
  return User.findByPk(username);
}
