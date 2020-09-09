import Image from "../../entities/Image";

export interface IImageDao {
  getOne: (blob: string) => {};
}

class ImageDao implements IImageDao {
  /**
   * @param * Data blob of the image in the form of a base64 encoded string
   *
   */

  public async getOne() {
    const imageBlob = await Image.findAll({
      attributes: ["blob"],
    });
    return imageBlob;
  }
}

export default ImageDao;
