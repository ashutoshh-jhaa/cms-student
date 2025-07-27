import multer from "multer";
import path from "node:path";

const uploadPath = path.resolve(import.meta.dirname, "..", "uploads");

//config multer storage engine
//diskStorage defines where and how will the file be stored on the disk
//storage is the storage engine config you pass to the multer
//these functions are called byy the multer middleware before the req and res are handled by the express
const storage = multer.diskStorage({
  //this function tell multer where to store the file
  // the file is injected by multera
  // first null in cb means no error
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  //what should be the name of the file be when stored on the diskStorage
  filename: (req, file, cb) => {
    //generate a unique filename
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

//initialize multer and use this to upload images
const upload = multer({ storage });
export default upload;
