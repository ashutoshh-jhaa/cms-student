import cloudinary from "../../config/cloudinary.js";

//async function to upload file to the cloudinary
export const cloudinaryFileUpload = async (path, type) => {
  try {
    const data = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
      folder: type === "student" ? "student" : "faculty",
    });
    console.log("file upload successful");
    return data;
  } catch (error) {
    console.log(error);
  }
};
