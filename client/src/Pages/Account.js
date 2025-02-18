import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import "../Styles/Account.css";

const Account = () => {
  const { token, user, loading, logout } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect if not logged in
    }
  }, [token, navigate]);

  if (loading) return <p>Loading user details...</p>;
  if (!user) return <p>User not found. Please log in again.</p>;

  return (
    <div className="account-container">
      <h2>My Account</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <h3>My Wishlist</h3>
      {user.wishlist?.length > 0 ? (
        <ul>
          {user.wishlist.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p>Your wishlist is empty.</p>
      )}

      <h3>My Orders</h3>
      {user.orders?.length > 0 ? (
        <ul>
          {user.orders.map((order) => (
            <li key={order._id}>
              Order ID: {order._id} - Status: {order.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no orders yet.</p>
      )}

      <h3>Saved Addresses</h3>
      {user.addresses?.length > 0 ? (
        <ul>
          {user.addresses.map((address, index) => (
            <li key={index}>{address}</li>
          ))}
        </ul>
      ) : (
        <p>No saved addresses.</p>
      )}

      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Account;
