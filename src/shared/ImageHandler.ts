import { fdatasync, existsSync, mkdirSync } from "fs";
import multer from "multer";

const imagePath = "./uploads";
if (!existsSync(imagePath)) {
  mkdirSync(imagePath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath + "/");
  },
  filename: (req, file, cb) => {
    cb(null, `${+new Date()}-${file.originalname.replace(/\s/g, "-")}`);
  },
});

export default multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
