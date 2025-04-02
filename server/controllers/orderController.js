import orderModel from "../models/orderModel.js";
import UserModel from "../models/UserModel.js";
import razorpay from "razorpay";
import dotenv from "dotenv";
import {
  createOrder,
  fetchAvailableCouriers,
  assignCourier,
  trackShipment,
  returnOrder,
  exchangeOrder,
} from "../helpers/shiprocketHelper.js";
dotenv.config();

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const updateStock = async (items) => {
  const bulkOperations = [];

  for (const item of items) {
    bulkOperations.push({
      updateOne: {
        filter: { _id: item.productID, "sizes.size": item.size },
        update: { $inc: { "sizes.$.stock": -item.quantity } },
      },
    });
  }

  if (bulkOperations.length > 0) {
    await ProductModel.bulkWrite(bulkOperations);
  }
};

// Placing orders using online payment method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const formattedItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size || null, // Store size if provided
      customization: item.customization || null, // Store customization if provided
    }));

    const orderData = {
      userId,
      items: formattedItems,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
      }
      res.json({ success: true, order, message: "Order Placed Successfully" });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      const order = await orderModel.findByIdAndUpdate(
        orderInfo.receipt,
        { payment: true },
        { new: true }
      );

      await UserModel.findByIdAndUpdate(userId, { cartData: {} });
      const shiprocketResponse = await createOrder(order);

      if (shiprocketResponse && shiprocketResponse.order_id) {
        const courierResponse = await fetchAvailableCouriers(order);
        if (!courierResponse || !courierResponse.courier_company_id) {
          return res.json({
            success: false,
            message: "No available courier found",
          });
        }
        const assignCourierResponse = await assignCourier(
          shiprocketResponse.shipment_id,
          courierResponse.courier_company_id
        );
        if (
          !assignCourierResponse ||
          assignCourierResponse.awb_assign_status !== 1
        ) {
          return res.json({
            success: false,
            message: "Failed to assign courier",
          });
        }
        const awbCode = assignCourierResponse.response?.data?.awb_code;
        if (awbCode) {
          await orderModel.findByIdAndUpdate(order._id, {
            awbNumber: awbCode,
            courierName: courierResponse.courier_name,
            status: "Order Placed",
          });
        } else {
          return res.json({
            success: false,
            message: "Failed to retrieve AWB Code",
          });
        }
        const shipmentTracking = await trackShipment(awbCode);
        if (shipmentTracking) {
          await orderModel.findByIdAndUpdate(order._id, {
            shipmentStatus: shipmentTracking.status,
          });
        }
      }

      // const pickupResponse = await schedulePickup(
      //   shiprocketResponse.shipment_id,
      //   order // Pass the order data to schedule pickup
      // );
      // if (!pickupResponse || !pickupResponse.pickup_scheduled_date) {
      //   return res.json({
      //     success: false,
      //     message: "Failed to schedule pickup",
      //   });
      // }
      // console.log(
      //   "📦 Pickup Scheduled for:",
      //   pickupResponse.pickup_scheduled_date
      // );

      res.json({
        success: true,
        message: "Payment Successful and Order Sent to Shiprocket",
      });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error in verifyRazorpay:", error.message);
    res.json({ success: false, message: error.message });
  }
};

const trackOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order || !order.awbNumber) {
      return res.json({
        success: false,
        message: "Order not found or AWB missing",
      });
    }
    const trackingInfo = await trackShipment(order.awbNumber);

    if (!trackingInfo || !trackingInfo.tracking_data) {
      return res.json({
        success: false,
        message: "Tracking information not available.",
      });
    }

    res.json({ success: true, trackingInfo: trackingInfo.tracking_data });
  } catch (error) {
    console.error(" Error in trackOrderStatus:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// All orders for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// user orders data
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const createReturnOrderController = async (req, res) => {
  try {
    console.log("🔥 Incoming Request Body:", req.body);

    const { orderId, reason, }= req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const returnOrderResponse = await returnOrder({ order, reason });

    res.status(200).json({
      message: "Return order created successfully",
      data: returnOrderResponse,
    });
  } catch (error) {
    console.error("Error in returnOrderController:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createExchangeOrderController = async (req, res) => {
  try {
    const { orderId, exchangeItem } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    const response = await exchangeOrder(order, exchangeItem);
    if (response.success) {
      await orderModel.findByIdAndUpdate(orderId, {
        status: "Exchange Initiated",
      });
      res.json({
        success: true,
        message: "Exchange order created successfully",
      });
    } else {
      res.json({ success: false, message: response.message });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  verifyRazorpay,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  trackOrderStatus,
  createReturnOrderController,
  createExchangeOrderController,
};
