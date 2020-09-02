import DBInstance from "../DBInstance";
import Image from "../../entities/Image";

export interface IImageDao {
  getOne: (blob: string) => {};
}

class ImageDao implements IImageDao {
  /**
   * @param blob
   *
   */

  public async getOne() {
    try {
      await DBInstance.authenticate();
      console.log("Connection has been established successfully.");
      const imageBlob = await Image.findAll({
        attributes: ["blob"],
      });
      return imageBlob;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

export default ImageDao;
