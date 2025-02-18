import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import "../Styles/Orders.css";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  // Function to load user orders
  const loadOrders = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            item["_id"] = order._id;

            // Store order ID for tracking
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  // Function to track order
  const trackOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/track-order`,
        { orderId },
        { headers: { token } }
      );

      console.log("📦 Tracking response:", response.data); // Debugging

      if (response.data.success && response.data.trackingInfo) {
        const trackUrl = response.data.trackingInfo.track_url;
        if (trackUrl) {
          console.log("🔗 Redirecting to:", trackUrl);
          window.location.href = trackUrl;
        } else {
          console.error("❌ Tracking URL is missing in response.");
          alert("Tracking information is not available.");
        }
      } else {
        console.error(response.data.message);
        alert(response.data.message || "Tracking information not available.");
      }
    } catch (error) {
      console.error("❌ Error tracking order:", error);
      alert("Failed to track the order. Please try again later.");
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  return (
    <div className="orders-container container">
      <div className="orders-header">
        <h2 className="orders-header-title">My Orders</h2>
      </div>
      <div>
        {orderData.map((item, index) => (
          <div key={index} className="order-item">
            <div className="order-details">
              <img className="order-image" src={item.image[0]} alt="" />
              <div>
                <p className="order-name">{item.name}</p>
                <div className="order-meta">
                  <p className="order-price">
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="order-date">
                  Date:{" "}
                  <span className="order-date-value">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
              </div>
            </div>
            <div className="order-actions">
              <div className="order-status">
                <p className="status-indicator"></p>
                <p className="status-text">{item.status}</p>
              </div>
              <button
                onClick={() => trackOrder(item._id)}
                className="track-order-button"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
