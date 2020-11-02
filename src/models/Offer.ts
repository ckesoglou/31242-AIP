import { Model } from "sequelize";
import User from "./User";

// Class definition

export interface IOfferAttributes {
  id: string;
  author: string;
  completed_by?: string;
  proof_of_completion?: string;
  details: string;
  created_time: Date;
  completion_time?: Date;
  is_completed: boolean;
}

class Offer extends Model<IOfferAttributes> implements IOfferAttributes {
  public id!: string;
  public author!: string;
  public completed_by!: string;
  public proof_of_completion!: string;
  public details!: string;
  public created_time!: Date;
  public completion_time!: Date;
  public is_completed!: boolean;
}

// Offer relationships

export async function initialiseOfferRelationships() {
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
}

export default Offer;
