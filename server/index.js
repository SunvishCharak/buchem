import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import connectCloudinary from "./config/cloudinary.js";
import cartRouter from "./routes/cartRoute.js";
import connectDB from "./config/mondodb.js";
import userRouter from "./routes/UserRoute.js";
import productRouter from "./routes/ProductRoute.js";
import orderRouter from "./routes/orderRoute.js";
import customBoxRouter from "./routes/CustomRoute.js"
import mongoose from "mongoose";

dotenv.config();
await connectCloudinary();


// // Multer Storage for Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "uploads",
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//   },
// // });
// const upload = multer({ storage });

// app setup
const app = express();
const port = process.env.PORT || 4000;

connectDB();

// middleware
app.use(express.json());
app.use(cors());


// api endpoints
app.use("/api/cart", cartRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/custom-box", customBoxRouter);

app.get("/", (req, res) => {
  res.send("API is Working...");
});
// app.listen(port, () => console.log(`Server is running on port ${port}`));

// app.use("/api/upload", uploadImage);



app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));

