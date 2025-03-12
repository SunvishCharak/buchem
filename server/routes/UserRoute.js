import express from "express";

import {
  loginUser,
  registerUser,
  adminLogin,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getUserAccount,
  redeemWallet,
  creditWallet,
  sendOTP,
  verifyOTP,
  resetPassword
} from "../controllers/UserController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/admin", adminLogin);
// Wishlist routes
userRouter.post("/wishlist/add", authUser, addToWishlist);
userRouter.post("/wishlist/remove", authUser, removeFromWishlist);
userRouter.get("/wishlist", authUser, getUserWishlist);

// Account route
userRouter.get("/account", authUser, getUserAccount);

// Wallet routes
userRouter.post("/wallet/redeem", authUser, redeemWallet);
userRouter.post("/wallet/credit", authUser, creditWallet);

userRouter.post("/forgot-password", sendOTP);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
