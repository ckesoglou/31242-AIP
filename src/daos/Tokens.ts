import { DataTypes } from "sequelize";
import Token from "../entities/Token";
import db from "./DBInstance";

Token.init(
  {
    refresh_token: {
      type: DataTypes.STRING(),
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    device_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    created_time: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    expiry_time: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
  },
  { sequelize: db, tableName: "users" }
);

export async function getToken(refresh_token: string) {
  return Token.findByPk(refresh_token);
}

export async function createToken(
  refresh_token: string,
  username: string,
  device_name: string,
  created_time: Date,
  expiry_time: Date
) {
  return await Token.create({
    refresh_token: refresh_token,
    username: username,
    device_name: device_name,
    created_time: created_time,
    expiry_time: expiry_time,
  });
}
