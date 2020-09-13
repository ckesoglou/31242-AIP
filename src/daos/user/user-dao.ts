import User, { IUser } from "@entities/user";
import db from "../db-instance";

export interface IUserDao {
  getOne: (username: string) => Promise<IUser | null>;
  getAll: () => Promise<IUser[]>;
  add: (user: IUser) => Promise<void>;
  update: (user: IUser) => Promise<void>;
  delete: (username: string) => Promise<void>;
}

class UserDao implements IUserDao {
  /**
   * @param email
   */
  public async getOne(username: string): Promise<IUser | null> {
    const user = await User.findByPk(username, {
      attributes: ["display_name"],
    });
    return user;
  }

  /**
   *
   */
  public async getAll(): Promise<IUser[]> {
    const users = await User.findAll({
      attributes: ["display_name"],
    });
    return users;
  }

  /**
   *
   * @param user
   */
  public async add(user: IUser): Promise<void> {
    // TODO
    return {} as any;
  }

  /**
   *
   * @param user
   */
  public async update(user: IUser): Promise<void> {
    // TODO
    return {} as any;
  }

  /**
   *
   * @param id
   */
  public async delete(username: string): Promise<void> {
    // TODO
    return {} as any;
  }
}

export default UserDao;