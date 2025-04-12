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
import { getEstimatedDelivery,calculateShippingCharges } from "../helpers/shiprocketHelper.js";

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

//shipping charges
orderRouter.get("/shipping-charges", async (req, res) => {
  const { zipcode, weight, isCOD } = req.query;

  if (!zipcode || zipcode.length !== 6 || !/^\d+$/.test(zipcode)) {
    return res.status(400).json({ error: "Missing zipcode" });
  }

  try {

    const totalWeight = parseFloat(weight) || 0.5;
    const cod = isCOD == "true";

    const charge = await calculateShippingCharges(zipcode, parseFloat(weight) || 0.5);
    res.json({charge});
  } catch (err) {
    console.error("Shipping charge error:", err.message);
    res.status(500).json({ error: "Unable to calculate shipping charges" });
  }
});

export default orderRouter;
