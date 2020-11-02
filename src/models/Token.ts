import { Model } from "sequelize";
import User from "./User";

// Class definition

export interface ITokenCookie {
  username: string;
  token: string;
}

interface ITokenAttributes {
  refresh_token: string;
  username: string;
  device_name: string;
  created_time: Date;
  expiry_time: Date;
}

class Token extends Model<ITokenAttributes> implements ITokenAttributes {
  public refresh_token!: string;
  public username!: string;
  public device_name!: string;
  public created_time!: Date;
  public expiry_time!: Date;
}

// Token relationships

export async function initialiseTokenRelationships() {
  const UsernameForeignKey = {
    foreignKey: {
      name: "username",
      allowNull: false,
    },
  };
  Token.belongsTo(User, UsernameForeignKey);
  User.hasMany(Token, UsernameForeignKey);
}

export default Token;
