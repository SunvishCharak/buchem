import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import connectDB from "./config/mondodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/UserRoute.js";
import productRouter from "./routes/ProductRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app setup
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/cart", cartRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API is Working...");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
