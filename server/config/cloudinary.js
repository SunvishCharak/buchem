import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: "dvf9yapqm",
    api_key: "565463457726977",
    api_secret: "jqVUVb8IT8DcUQbp7AGjFMuNnFs",
  });
};

export default connectCloudinary;
