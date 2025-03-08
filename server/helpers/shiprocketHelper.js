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
    if (!token) throw new Error("❌ Shiprocket Token is missing!");

    if (
      !order.items ||
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      throw new Error("❌ Order items are missing!");
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

      // Order Items
      order_items: formattedOrderItems,

      payment_method: "Prepaid",
      shipping_charges: order.delivery_fee || 0,
      giftwrap_charges: order.giftwrap_charges || 0,
      transaction_charges: order.transaction_charges || 0,
      total_discount: order.total_discount || 0,
      sub_total: subTotal,
      // Dimensions & Weight
      length: 10,
      breadth: 10,
      height: 10,
      weight: order.weight || 0.5,
    };

    console.log(
      "🚀 Order Data Before API Call:",
      JSON.stringify(orderData, null, 2)
    );
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
    console.log("🚀 Shiprocket Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Shiprocket API Error:",
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
    console.log("📌 Order object:", order);

    const pickupPincode = "122002"; // Change this to your actual pickup pincode
    const billingPincode = order.address.zipcode;
    const weight = order.items.reduce((total, item) => {
      return total + (item.weight || 0.5); // Default weight = 0.5kg if not provided
    }, 0);

    if (!pickupPincode || !billingPincode || !weight) {
      throw new Error(
        "Missing required parameters: pickupPincode, billingPincode, or weight"
      );
    }

    console.log("📌 Pickup Pincode:", pickupPincode);
    console.log("📌 Billing Pincode:", billingPincode);
    console.log("📌 Weight:", weight);

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${billingPincode}&cod=0&weight=${weight}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("🚀 Courier Response:", response.data);

    const recommendedCourierId =
      response.data?.data?.recommended_courier_company_id;
    if (!recommendedCourierId) {
      console.error("❌ No recommended courier found");
      return null;
    }

    console.log("🚚 Selected Courier ID:", recommendedCourierId);
    return { courier_company_id: recommendedCourierId };
  } catch (error) {
    console.error(
      "❌ Error fetching couriers:",
      error.response?.data || error.message
    );
    return null;
  }
};

// 🔹 Assign Courier
const assignCourier = async (shipment_id, courier_id) => {
  try {
    if (!shipment_id || !courier_id) {
      console.error("❌ shipment_id or courier_id is missing");
      return null;
    }
    const token = await getShiprocketToken();
    console.log("📦 Assigning Courier:", { shipment_id, courier_id });

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

    console.log("🚀 Courier Assigned Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error assigning courier:",
      error.response?.data || error.message
    );
    return null;
  }
};

// Pickup Shipment
const schedulePickup = async (shipment_id, order) => {
  try {
    const token = await getShiprocketToken(); // Retrieve Shiprocket token

    // Calculate pickup date (1 day ahead)
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 1); // Add 1 day
    const formattedDate = pickupDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Set pickup time to 6:00 PM (18:00)
    const pickupTime = "18:00"; // You can adjust this to any other evening time if needed

    // Fetch address from the order data
    const pickupAddress =
      order.pickup_location ||
      "Building no.1326, Room no 303 Third Floor, Sector 43, Sushant lok, Phase 1, Opp Shalom Hills International School, Gurgaon, Haryana, India, 122002"; // Assuming address is available in the order data
    const contactNumber = "6284987504"; // Replace with actual contact number from order data

    // API call to schedule pickup
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup", // Correct API endpoint
      {
        shipment_id,
        pickup_date: formattedDate, // Use dynamically calculated date
        pickup_time: pickupTime, // Evening pickup time
        contact_number: contactNumber, // Use contact number from order
        pickup_address: pickupAddress, // Use address from order
      },
      { headers: { Authorization: `Bearer ${token}` } } // Add Authorization header with token
    );

    return response.data; // Return response data to proceed with further steps
  } catch (error) {
    console.error(
      "❌ Error scheduling pickup:",
      error.response?.data || error.message
    );
    return null; // Return null in case of error
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

    console.log("Shipment tracking response:", response.data);
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

const returnOrder = async (returnOrderData) => {
  try {
    const token = await getShiprocketToken();
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/return",
      returnOrderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create return order:", error.message);
    throw error;
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
