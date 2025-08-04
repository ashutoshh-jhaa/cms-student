import cloudinary from "../../config/cloudinary.js";

//async function to upload file to the cloudinary
export const cloudinaryFileUpload = async (path, folder) => {
  try {
    const data = await cloudinary.uploader.upload(path, {
      resource_folder: "auto",
      folder: folder === "student" ? "student" : "faculty",
    });
    console.log("file upload successful");
    return data;
  } catch (error) {
    console.log(error);
  }
};
