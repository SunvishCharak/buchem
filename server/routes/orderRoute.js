import express from "express";
import AdminAuth from "../middleware/AdminAuth.js";
import authUser from "../middleware/auth.js";

import {
  placeOrderRazorpay,
  allOrders,
  updateStatus,
  userOrders,
  verifyRazorpay,
  trackOrderStatus,
  createReturnOrderController,
  createExchangeOrderController,
} from "../controllers/orderController.js";
import { getEstimatedDelivery } from "../helpers/shiprocketHelper.js";

const orderRouter = express.Router();

// admin routes
orderRouter.post("/list", AdminAuth, allOrders);
orderRouter.post("/status", AdminAuth, updateStatus);

// Payment methods
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// user orders
orderRouter.post("/userorders", authUser, userOrders);

// verify payment
orderRouter.post("/verifyrazorpay", authUser, verifyRazorpay);

// track order
orderRouter.post("/track-order", authUser, trackOrderStatus);

// get estimated delivery
orderRouter.post("/estimated-delivery", getEstimatedDelivery);

// return order
orderRouter.post("/return-order", authUser, createReturnOrderController);

// exchange order
orderRouter.post("/exchange-order", authUser, createExchangeOrderController);

export default orderRouter;
