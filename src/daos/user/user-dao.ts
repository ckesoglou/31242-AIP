import User, { IUser } from "@entities/User";
import db from "../db-instance";

export interface IUserDao {
  getOne: (username: string) => Promise<IUser | null>;
  getAll: () => Promise<IUser[]>;
  update: (username: string, newUser: IUser) => Promise<IUser | null>;
  delete: (username: string) => Promise<boolean>;
}

class UserDao implements IUserDao {
  public async getOne(username: string): Promise<IUser | null> {
    const user = await User.findByPk(username);
    return user;
  }

  public async getAll(): Promise<IUser[]> {
    const users = await User.findAll({
      attributes: ["display_name"],
    });
    return users;
  }

  public async update(userName: String, newUser: IUser): Promise<IUser | null> {
    User.findOne({ where: { username: `${userName}` } }).then(function (user) {
      if (user) {
        user
          .update({
            display_name: newUser.displayName,
            username: newUser.username,
          })
          .then(async function () {
            await User.sync({ alter: true });
            return newUser;
          });
      }
    });
    return null;
  }

  public async delete(userName: string): Promise<boolean> {
    User.findOne({ where: { username: `${userName}` } }).then(function (user) {
      if (user) {
        user.destroy().then(async function () {
          await User.sync({ alter: true });
          return true;
        });
      }
    });
    return false;
  }
}

export default UserDao;
