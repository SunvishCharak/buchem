import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
  applyCoupon,
  removeCoupon,
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/get", authUser, getUserCart);
cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/update", authUser, updateCart);
cartRouter.post("/apply-coupon", authUser, applyCoupon);
cartRouter.post("/remove-coupon", authUser, removeCoupon);

export default cartRouter;
