import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME || "dvf9yapqm",
    api_key: process.env.CLOUDINARY_API_KEY || "565463457726977",
    api_secret:
      process.env.CLOUDINARY_SECRET_KEY || "jqVUVb8IT8DcUQbp7AGjFMuNnFs",
  });
};

export default connectCloudinary;
