import { DataTypes } from "sequelize";
import Item, { IItemAttributes } from "../models/Item";
import db from "./DBInstance";

/*
 *  Items database table definition
 */

// item table

Item.init(
  {
    id: {
      type: "UNIQUEIDENTIFIER",
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

/*
 *  Item CRUD operations
 */

export async function getItem(id: string) {
  return Item.findByPk(id);
}

export async function getItems() {
  return Item.findAll();
}

export async function createItem(item: IItemAttributes) {
  return Item.create(item);
}
