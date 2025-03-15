import express from "express";

import {
  registerUser,
  loginUser,
  adminLogin,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getUserAccount,
  redeemWallet,
  creditWallet,
  sendRegistrationOTP,
  sendLoginOTP,
  loginWithOTP,
  sendResetOTP,
  resetPassword,
} from "../controllers/UserController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/login/otp/send", sendLoginOTP);
userRouter.post("/login/otp/verify", loginWithOTP);
userRouter.post("/register", registerUser);
userRouter.post("/register/otp", sendRegistrationOTP);
userRouter.post("/admin", adminLogin);

userRouter.post("/forgot-password/otp", sendResetOTP);
userRouter.post("/forgot-password/reset", resetPassword);
// Wishlist routes
userRouter.post("/wishlist/add", authUser, addToWishlist);
userRouter.post("/wishlist/remove", authUser, removeFromWishlist);
userRouter.get("/wishlist", authUser, getUserWishlist);

// Account route
userRouter.get("/account", authUser, getUserAccount);

// Wallet routes
userRouter.post("/wallet/redeem", authUser, redeemWallet);
userRouter.post("/wallet/credit", authUser, creditWallet);

export default userRouter;
