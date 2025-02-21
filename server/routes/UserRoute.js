import express from "express";

import {
  loginUser,
  registerUser,
  adminLogin,

  getUserProfile,
  getUserWishlist,
  getUserOrders,
  getUserAddresses
  
} from "../controllers/UserController.js";
import {protect} from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/admin", adminLogin);

userRouter.get("/profile", protect, getUserProfile);
userRouter.get("/wishlist", protect, getUserWishlist);
userRouter.get("/orders",  protect , getUserOrders);
userRouter.get("/addresses", protect, getUserAddresses);

export default userRouter;
