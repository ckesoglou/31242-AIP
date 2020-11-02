import { Model } from "sequelize";

// Class definition

interface IUserAttributes {
  username: string;
  display_name: string;
  password_hash: string;
}

class User extends Model<IUserAttributes> implements IUserAttributes {
  public username!: string;
  public display_name!: string;
  public password_hash!: string;
}

export default User;
