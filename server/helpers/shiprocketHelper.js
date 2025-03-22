import axios from "axios";

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let shiprocketToken = null;

const getShiprocketToken = async () => {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      }
    );
    shiprocketToken = response.data.token;
    return shiprocketToken;
  } catch (error) {
    console.error(
      "Error getting Shiprocket token",
      error.response?.data || error.message
    );
    throw new Error("Shiprocket Authentication Failed");
  }
};
const createOrder = async (order) => {
  try {
    const token = await getShiprocketToken();
    if (!token) throw new Error(" Shiprocket Token is missing!");
    if (
      !order.items ||
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      throw new Error("Order items are missing!");
    }
    const formattedOrderItems = order.items.map((item) => ({
      name: item.name,
      sku: item.sku || item._id,
      units: item.quantity || 1,
      selling_price: item.price,
      discount: 0,
      tax: 0,
    }));
    const subTotal = order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const orderData = {
      order_id: String(order._id),
      order_date: new Date().toISOString(),
      pickup_location: "Home",
      pickup_pincode: "122002",
      channel_id: "",
      comment: "Order from MERN Store",
      billing_customer_name: order.address.firstName || "Test",
      billing_last_name: order.address.lastName || "Test",
      billing_address: `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}`,
      billing_city: order.address.city || " City",
      billing_pincode: String(order.address.zipcode || "000000"),
      billing_state: order.address.state || "State",
      billing_country: "India",
      billing_email: order.address.email || "test@example.com",
      billing_phone: String(order.address.phone || "0000000000"),
      shipping_is_billing: true,
      order_items: formattedOrderItems,
      payment_method: "Prepaid",
      shipping_charges: order.delivery_fee || 0,
      giftwrap_charges: order.giftwrap_charges || 0,
      transaction_charges: order.transaction_charges || 0,
      total_discount: order.total_discount || 0,
      sub_total: subTotal,
      length: 10,
      breadth: 10,
      height: 10,
      weight: order.weight || 0.5,
    };
    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(orderData),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(
      "Shiprocket API Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create order on Shiprocket"
    );
  }
};

// 🔹 Fetch Available Couriers
const fetchAvailableCouriers = async (order) => {
  try {
    const token = await getShiprocketToken();
    const pickupPincode = "122002";
    const billingPincode = order.address.zipcode;
    const weight = order.items.reduce((total, item) => {
      return total + (item.weight || 0.5);
    }, 0);

    if (!pickupPincode || !billingPincode || !weight) {
      throw new Error(
        "Missing required parameters: pickupPincode, billingPincode, or weight"
      );
    }

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${billingPincode}&cod=0&weight=${weight}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const recommendedCourierId =
      response.data?.data?.recommended_courier_company_id;
    if (!recommendedCourierId) {
      console.error("No recommended courier found");
      return null;
    }
    return { courier_company_id: recommendedCourierId };
  } catch (error) {
    console.error(
      "Error fetching couriers:",
      error.response?.data || error.message
    );
    return null;
  }
};

// 🔹 Assign Courier
const assignCourier = async (shipment_id, courier_id) => {
  try {
    if (!shipment_id || !courier_id) {
      console.error(" shipment_id or courier_id is missing");
      return null;
    }
    const token = await getShiprocketToken();
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
      { shipment_id, courier_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error assigning courier:",
      error.response?.data || error.message
    );
    return null;
  }
};

// Pickup Shipment
const schedulePickup = async (shipment_id, order) => {
  try {
    const token = await getShiprocketToken();
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 1);
    const formattedDate = pickupDate.toISOString().split("T")[0];
    const pickupTime = "18:00";
    const pickupAddress =
      order.pickup_location ||
      "Building no.1326, Room no 303 Third Floor, Sector 43, Sushant lok, Phase 1, Opp Shalom Hills International School, Gurgaon, Haryana, India, 122002"; // Assuming address is available in the order data
    const contactNumber = "6284987504";

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",
      {
        shipment_id,
        pickup_date: formattedDate,
        pickup_time: pickupTime,
        contact_number: contactNumber,
        pickup_address: pickupAddress,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error(
      " Error scheduling pickup:",
      error.response?.data || error.message
    );
    return null;
  }
};

// Function to get estimated delivery time
const getEstimatedDelivery = async (req, res) => {
  try {
    const { pincode } = req.body;
    if (!pincode) {
      return res.json({ success: false, message: "Pincode is required" });
    }
    const token = await getShiprocketToken();
    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/`,
      {
        params: {
          pickup_postcode: "122002",
          delivery_postcode: pincode,
          cod: 0,
          weight: 0.5,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (
      response.data &&
      response.data.data.available_courier_companies.length > 0
    ) {
      const estimatedDelivery =
        response.data.data.available_courier_companies[0].etd;
      return res.json({ success: true, estimatedDelivery });
    } else {
      return res.json({
        success: false,
        message: "Delivery service unavailable for this PIN code.",
      });
    }
  } catch (error) {
    console.error("Error fetching estimated delivery time:", error.message);
    res.json({
      success: false,
      message: "Failed to fetch estimated delivery time",
    });
  }
};

// Track Order using AWB Number
const trackShipment = async (awb_code) => {
  try {
    const token = await getShiprocketToken();
    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb_code}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error tracking shipment:", error.response.data);
    } else if (error.request) {
      console.error("No response received from the server.");
    } else {
      console.error("Error setting up the request:", error.message);
    }
    return null;
  }
};

const returnOrder = async (req, res) => {
  try {

    console.log("🔥 Request Body:", req.body); // Debugging line
    
    const token = await getShiprocketToken();
    if (!token) throw new Error("Shiprocket Token is missing!");

    const { orderId, reason } = req.body;
    const order = await orderModel.findById(orderId).populate("userId");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const formattedOrderItems = order.items.map((item) => ({
      name: item.name,
      sku: item.sku || item._id,
      units: item.quantity || 1,
      selling_price: item.price,
      discount: 0,
      tax: 0,
    }));
    const { _id, address, paymentMethod, amount } = order;
    const returnOrderPayload = {
      order_id: _id.toString(),
      order_date: new Date().toISOString().split("T")[0],
      channel_id: "1",
      pickup_customer_name: address.firstName,
      pickup_last_name: address.lastName || "",
      pickup_address: address.street,
      pickup_address_2: "",
      pickup_city: address.city,
      pickup_state: address.state,
      pickup_country: address.country,
      pickup_pincode: address.zipcode,
      pickup_email: address.email,
      pickup_phone: address.phone,
      pickup_isd_code: "91",
      shipping_customer_name: "Ankur",
      shipping_last_name: "Mittal",
      shipping_address:
        "Building No. 1326, Sushant lok phase 1, Block C, Sector 43 service road, Gurgaon",
      shipping_address_2: "",
      shipping_city: "Gurgaon",
      shipping_state: "Harayana",
      shipping_country: "India",
      shipping_pincode: "122002",
      shipping_email: "buchemindia@gmail.com",
      shipping_phone: "6284987504",
      shipping_isd_code: "91",
      order_items: formattedOrderItems,
      payment_method: paymentMethod.toUpperCase(),
      sub_total: amount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
      reason,
    };
    const config = {
      method: "post",
      url: "https://apiv2.shiprocket.in/v1/external/orders/create/return",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: returnOrderPayload,
    };
    const response = await axios(config);
    if (response.data.status_code === 1) {
      await orderModel.findByIdAndUpdate(orderId, {
        status: "Return Initiated",
      });
      return res.json({
        success: true,
        message: "Return order created successfully",
        data: response.data,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: response.data.message });
    }
  } catch (error) {
    console.error("Error creating return order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const exchangeOrder = async (exchangeOrderData) => {
  try {
    const token = await getShiprocketToken();
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/exchange",
      exchangeOrderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create exchange order:", error.message);
    throw error;
  }
};

export {
  createOrder,
  assignCourier,
  fetchAvailableCouriers,
  schedulePickup,
  trackShipment,
  getEstimatedDelivery,
  returnOrder,
  exchangeOrder,
};
