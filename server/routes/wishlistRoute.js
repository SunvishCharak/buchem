import express from "express";
import authUser from "../middleware/auth.js";

import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", authUser, addToWishlist);
wishlistRouter.post("/remove", authUser, removeFromWishlist);
wishlistRouter.get("/get", authUser, getUserWishlist);

export default wishlistRouter;
