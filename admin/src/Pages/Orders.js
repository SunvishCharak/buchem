import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../Assets/assets";
import "../Styles/Orders.css"; // Import the new CSS file

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Orders</h3>
      <div className="order">
        {orders.map((order, index) => (
          <div key={index} className="order-item grid">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              {order.items.map((item, index) => (
                <p key={index} className="order-text">
                  {item.name} x {item.quantity} <span>{item.size}</span>
                </p>
              ))}
              <p className="order-text">
                {order.address.firstName} {order.address.lastName}
              </p>
              <div className="order-address">
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div className="order-details">
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Paid" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleString()}</p>
            </div>
            <p className="order-amount">
              {currency}: {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="order-status"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Order Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
