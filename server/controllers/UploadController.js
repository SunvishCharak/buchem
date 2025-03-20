import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // Needed to delete temporary files after upload
import multer from "multer";



const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });

    // Remove the file from the server after uploading to Cloudinary
    fs.unlinkSync(file.path);

    return result.secure_url;
  } catch (error) {
    console.error("Image Upload Error:", error);
    throw new Error("Failed to upload image");
  }
};

// Multiple images upload handler
const uploadImages = async (files) => {
  try {
    const imageUrls = await Promise.all(
      files.map(async (file) => await uploadImage(file))
    );
    return imageUrls;
  } catch (error) {
    console.error("Multiple Image Upload Error:", error);
    throw new Error("Failed to upload multiple images");
  }
};

export { uploadImage, uploadImages };
