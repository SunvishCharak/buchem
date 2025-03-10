import express from "express";
import upload from "../middleware/multer.js";
import AdminAuth from "../middleware/AdminAuth.js";

import {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  addReview,
  getReviews,
} from "../controllers/ProductController.js";
const productRouter = express.Router();

productRouter.post(
  "/add",
  AdminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.post("/remove", AdminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProduct);
productRouter.post("/addReview", upload.array("images", 4), addReview);
productRouter.get("/reviews/:productId", getReviews);

export default productRouter;
