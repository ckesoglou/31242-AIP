import { Model } from "sequelize";

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

  // constructor(
  //   refresh_token: string,
  //   username: string,
  //   device_name: string,
  //   created_time: Date,
  //   expiry_time: Date
  // ) {
  //   super();
  //   this.refresh_token = refresh_token;
  //   this.username = username;
  //   this.device_name = device_name;
  //   this.created_time = created_time;
  //   this.expiry_time = expiry_time;
  // }
}

export default Token;
