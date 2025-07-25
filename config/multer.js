import multer from "multer";
import path from "node:path";

const uploadPath = path.resolve(import.meta.dirname, "..", "uploads");

//config multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

//initialize multer and use this to upload images
const upload = multer({ storage });
export default upload;
