import User from "../models/User";
import { DataTypes, Op } from "sequelize";
import Offer, { IOfferAttributes } from "../models/Offer";
import db from "./DBInstance";

Offer.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    completed_by: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    proof_of_completion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    details: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_time: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    completion_time: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "offers",
    timestamps: false,
  }
);

const AuthorForeignKey = {
  foreignKey: {
    name: "author",
    allowNull: false,
  },
};
Offer.belongsTo(User, AuthorForeignKey);
User.hasMany(Offer, AuthorForeignKey);

const CompletedByForeignKey = {
  foreignKey: {
    name: "completed_by",
    allowNull: true,
  },
};
Offer.belongsTo(User, CompletedByForeignKey);
User.hasMany(Offer, CompletedByForeignKey);

export async function getOffer(id: string) {
  return Offer.findByPk(id);
}

export interface IOffersFilter {
  author?: string;
  details?: {
    [Op.substring]: string;
  };
}

export async function getOffers(filter: IOffersFilter, start = 0, limit = 25) {
  return Offer.findAll({
    where: filter,
    order: [["created_time", "DESC"]],
    offset: start,
    limit: 9999, // TODO limit,
  });
}

export async function createOffer(attributes: IOfferAttributes) {
  return Offer.create(attributes);
}

export async function updateOffer(
  request: Offer,
  attributes: IOfferAttributes
) {
  return request.update(attributes);
}

export async function deleteOffer(request: Offer) {
  return request.destroy();
}
