import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

import "../Styles/Orders.css";

const Orders = () => {
  const {
    backendUrl,
    token,
    currency,
    returnOrder,
    exchangeOrder,
    trackShipment,
  } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [showReturnForm, setShowReturnForm] = useState(null);
  const [showExchangeForm, setShowExchangeForm] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [exchangeSize, setExchangeSize] = useState("");

  // Function to load user orders
  const loadOrders = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { Authorization:`Bearer ${token}` } }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            item["_id"] = order._id;
            allOrdersItem.push(item);
          });
        });
        console.log("Processed Orders:", allOrdersItem);
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  // Handle return order using context function
  const handleReturnOrder = async (orderId, name, reason) => {
    if (!reason) return;

    try {
      const success = await returnOrder(orderId, reason);
      console.log("🛒 Return Order ID:", orderId, "Product ID:", name, "Reason:", reason);
     
      if (success) {
        alert("Order return request submitted successfully.");
        loadOrders(); // Refresh orders
      } else {
        alert("Failed to return the order. Please try again.");
      }
    } catch (error) {
      console.error("Error in return order:", error);
      alert("An error occurred while returning the order.");
    }
  };

  // Handle exchange order using context function
  const handleExchangeOrder = async (orderId, name, newSize) => {
    if (!newSize) return;
    
    try { 
      const success = await exchangeOrder(orderId, name, newSize);
      console.log("🛒 Exchange Order ID:", orderId, "Product ID:", name, "New Size:", newSize);
      
      if (success) {
        alert("Order exchange request submitted successfully.");
        loadOrders(); // Refresh orders
      } else {
        alert("Failed to exchange the order. Please try again.");
      }
    } catch (error) {
      console.error("Error in exchange order:", error);
      alert("An error occurred while exchanging the order.");
    }
  };

  // Ensure only one form is shown at a time
  const toggleForm = (type, orderId, name) => {
    console.log("Toggle Form:", type, orderId, name);
    const formKey = `${orderId}-${name}`;
    if (type === "return") {
      setShowReturnForm((prev) => (prev === formKey ? null : formKey));
      setShowExchangeForm(null);
    } else if (type === "exchange") {
      setShowExchangeForm((prev) => (prev === formKey ? null : formKey));
      setShowReturnForm(null);
    }
    document.body.classList.toggle(
      "overlay-active",
      formKey === showReturnForm || formKey === showExchangeForm
    );
  };

  useEffect(() => {
    console.log("Token updated, loading orders...");
    loadOrders();
  }, [token]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("overlay-active");
    };
  }, []);

  return (
    <div className="orders-container container">
      <div className="orders-header">
        <h2 className="orders-header-title">My Orders</h2>
      </div>
      <div>
        {console.log("Order Data:", orderData)}
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
              <div className="order-buttons">
              <button
                onClick={() => toggleForm("return", item._id, item.name)}
                className={`action-button ${
                  showReturnForm === `${item._id}-${item.name}` ? "active" : ""
                }`}
              >
                Return
              </button>

              <button
                onClick={() => {
                  toggleForm("exchange", item._id, item.name)}}
                className={`action-button ${
                  showExchangeForm === `${item._id}-${item.name}` ? "active" : ""
                }`}
              >
                Exchange
              </button>

              <button
                onClick={() => trackShipment(item._id)}
                className="action-button track-order-button "
              >
                Track Order
              </button>
              </div>
            </div>
          </div>
        ))}

        {/* Return Order Form */}
        {showReturnForm && (
          <div className="form-container">
            <textarea
              placeholder="Reason for return"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="form-input"
            />
            <div className="form-actions">
              <button
                onClick={() => {
                  const [orderId, name] = showReturnForm.split("-");
                  handleReturnOrder(orderId, name, returnReason);
                  setShowReturnForm(null);
                  setReturnReason("");
                }}
                className="form-submit-button"
              >
                Submit
              </button>
              <button
                onClick={() => setShowReturnForm(null)}
                className="form-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Exchange Order Form */}
        {showExchangeForm && (
          <div className="form-container">
            <input
              type="text"
              placeholder="New size"
              value={exchangeSize}
              onChange={(e) => setExchangeSize(e.target.value)}
              className="form-input"
            />
            <div className="form-actions">
              <button
                onClick={() => {
                  const [orderId, name] = showExchangeForm.split("-");
                  handleExchangeOrder(orderId, name, exchangeSize);
                  setShowExchangeForm(null);
                  setExchangeSize("");
                }}
                className="form-submit-button"
              >
                Submit
              </button>
              <button
                onClick={() => setShowExchangeForm(null)}
                className="form-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;