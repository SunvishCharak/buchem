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
import { inspect } from "util";

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
    const orderData = {
      userId,
      items,
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
        // Assign the courier to the shipment
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
        console.log("✅ Courier Assigned Successfully");

        const awbCode = assignCourierResponse.response?.data?.awb_code;
        console.log("🚀 AWB Code:", awbCode);
        if (awbCode) {
          await orderModel.findByIdAndUpdate(order._id, {
            awbNumber: awbCode,
            courierName: courierResponse.courier_name,
            status: "Order Placed",
          });
        } else {
          console.log("AWB Code not found in the response");
          return res.json({
            success: false,
            message: "Failed to retrieve AWB Code",
          });
        }
        // Track the shipment using the AWB number
        const shipmentTracking = await trackShipment(awbCode);
        console.log("Shipment tracking data:", shipmentTracking);
        if (shipmentTracking) {
          console.log("🚚 Shipment Tracking Info:", shipmentTracking);
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
    console.error("❌ Error in verifyRazorpay:", error.message);
    res.json({ success: false, message: error.message });
  }
};

const trackOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Fetch order details from the database
    const order = await orderModel.findById(orderId);
    if (!order || !order.awbNumber) {
      return res.json({
        success: false,
        message: "Order not found or AWB missing",
      });
    }

    // Fetch shipment tracking data from Shiprocket
    const trackingInfo = await trackShipment(order.awbNumber);
    console.log("🚚 Shipment tracking response:", trackingInfo); // Debugging

    if (!trackingInfo || !trackingInfo.tracking_data) {
      return res.json({
        success: false,
        message: "Tracking information not available.",
      });
    }

    const trackUrl = trackingInfo.tracking_data.track_url;
    console.log("✅ Tracking URL:", trackUrl); // Debugging

    res.json({ success: true, trackingInfo: trackingInfo.tracking_data });
  } catch (error) {
    console.error("❌ Error in trackOrderStatus:", error.message);
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

// const createReturnOrderController = async (req, res) => {
//   try {
//     const { orderId, reason } = req.body;
//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       return res.json({ success: false, message: "Order not found" });
//     }

//     const response = await returnOrder(order, reason);
//     if (response.success) {
//       await orderModel.findByIdAndUpdate(orderId, {
//         status: "Return Initiated",
//       });
//       res.json({ success: true, message: "Return order created successfully" });
//     } else {
//       res.json({ success: false, message: response.message });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

const createReturnOrderController = async (createOrderPayload) => {
  try {
    console.log(
      "📦 Original Create Order Payload:",
      inspect(createOrderPayload, { depth: null, colors: true })
    );

    console.log("🛠️ Create Order Payload:", createOrderPayload);
    console.log("🆔 Order ID:", createOrderPayload?._id);
    // Function to auto-fill pickup details using shipping address
    const getPickupDetails = (shippingAddress) => {
      return {
        pickup_customer_name: shippingAddress.firstName,
        pickup_last_name: shippingAddress.lastName || "",
        company_name: "Your Company Name", // Set a default or fetch dynamically
        pickup_address: shippingAddress.street,
        pickup_address_2: "",
        pickup_city: shippingAddress.city,
        pickup_state: shippingAddress.state,
        pickup_country: shippingAddress.country,
        pickup_pincode: shippingAddress.zipcode,
        pickup_email: shippingAddress.email,
        pickup_phone: shippingAddress.phone,
        pickup_isd_code: "91", // Default country code (adjust if needed)
      };
    };

    // Build the return order payload
    const returnOrderPayload = {
      ...createOrderPayload,
      order_id: createOrderPayload?._id?.toString() || "N/A", // Safe access // Convert ObjectId to string if needed
      order_date: new Date().toISOString().split("T")[0], // Format to YYYY-MM-DD

      // Automatically fill pickup details
      ...getPickupDetails(createOrderPayload.address),

      order_items: createOrderPayload.items.map((item) => ({
        name: item.name,
        qc_enable: true, // Enable QC
        qc_product_name: item.name,
        sku: item._id, // Assuming the item ID serves as SKU
        units: item.quantity,
        selling_price: item.price,
        discount: 0, // Default to no discount (or calculate if needed)
        qc_brand: "Your Brand", // Set a default or fetch dynamically
        qc_product_image: item.image[0], // Use the first image in the array
      })),

      payment_method: createOrderPayload.paymentMethod.toUpperCase(),
      total_discount: "0",
      sub_total: createOrderPayload.amount,

      // Placeholder dimensions & weight (set dynamically if possible)
      length: 11,
      breadth: 11,
      height: 11,
      weight: 0.5,
    };

    console.log(
      "🚀 Final Return Order Payload:",
      JSON.stringify(returnOrderPayload, null, 2)
    );

    // Shiprocket API request configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/orders/create/return",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer {{token}}`, // Replace {{token}} with actual token
      },
      data: returnOrderPayload,
    };

    // Send request to Shiprocket
    const response = await axios(config);
    console.log(
      "✅ Return Order Created Successfully:",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(
        "❌ Error Details:",
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error("❌ Error:", error.message);
    }
    throw error;
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
