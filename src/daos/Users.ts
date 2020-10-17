import { DataTypes } from "sequelize";
import User from "../entities/User";
import db from "./DBInstance";

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
  {
    sequelize: db,
    tableName: "users",
    timestamps: false,
  }
);

export async function getUser(username: string) {
  return User.findByPk(username);
}

export async function createUser(
  username: string,
  display_name: string,
  password_hash: string
) {
  return User.create({
    username: username,
    display_name: display_name,
    password_hash: password_hash,
  });
}
