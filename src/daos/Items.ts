import { DataTypes } from "sequelize";
import Item from "../entities/Item";
import db from "./DBInstance";

Item.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "items",
    timestamps: false,
  }
);

export async function getItem(id: string) {
  return Item.findByPk(id);
}

export async function getItems() {
  return Item.findAll();
}
