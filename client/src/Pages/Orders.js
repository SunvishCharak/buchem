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


  // const handleRequest = async (data) => {
  //   const endpoint = data.exchangeItem ? "/api/orders/exchange" : "/api/orders/return";

  //   try {
  //     const response = await fetch(endpoint, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       body: JSON.stringify(data),
  //     });

  //     const result = await response.json();
  //     alert(result.message);
  //     closeReturnModal();
  //     closeExchangeModal();
  //   } catch (error) {
  //     console.error("Error submitting request:", error);
  //   }
  // };

  // Function to load user orders
  const loadOrders = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
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

  useEffect(() => {
    loadOrders();
  }, [token]);

  // Handle return order using context function
  const handleReturnOrder = async (orderId, itemName) => {
    const reason = prompt(`Why do you want to return ${itemName}?`);

    if (!reason) return;

    try {
      const success = await returnOrder(orderId, reason);
      if (success) {
        console.log("🛒 Return Order ID:", orderId);
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
  const handleExchangeOrder = async (orderId, productId, itemName) => {
    const newSize = prompt(
      `Please enter the new size for exchanging ${itemName}:`
    );

    if (!newSize) return;

    try {
      const success = await exchangeOrder(orderId, productId, newSize);
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

  useEffect(() => {
    loadOrders();
  }, [token]);

  return (
    <div className="orders-container container">
      <div className="orders-header">
        <h2 className="orders-header-title">My Orders</h2>
      </div>
      <div>
        {orderData.map((item) => (
          <div key={item._id} className="order-item">
            
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
                onClick={() => trackShipment(item._id)}
                className="track-order-button"
              >
                Track Order
              </button>

              <button
                onClick={() => handleReturnOrder(item)}
                className="return-order-button"
              >
                Return
              </button>

              <button
                onClick={() => handleExchangeOrder(item)}
                className="exchange-order-button"
              >
                Exchange
              </button>
            </div>
          </div>
        ))}
      </div>
        {/* Modal for Return & Exchange
        {returnmodalOpen && (
        <ReturnExchangeForm
          isOpen={openReturnModal}
          onClose={closeReturnModal}
          onSubmit={handleRequest}
          orderId={selectedOrder?._id}
        />
      )}

       {exchangeModalOpen && (
        <exchangeOrderForm
          isOpen={exchangeModalOpen}
          onClose={closeExchangeModal}
          onSubmit={handleRequest}
          orderId={selectedOrder?._id}
        />
       )} */}

    </div>
  );
};

export default Orders;
