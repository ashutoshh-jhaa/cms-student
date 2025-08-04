import cloudinary from "../../config/cloudinary.js";

export const cloudinaryFileDelete = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log(error);
  }
};
