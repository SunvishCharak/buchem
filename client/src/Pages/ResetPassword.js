import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext"; // Ensure correct import
import { useNavigate } from "react-router-dom";
import "../Styles/ResetPassword.css"; // Make sure this CSS file is linked

const ResetPassword = () => {
  const { sendOtp } = useContext(ShopContext); // Get sendOtp function from ShopContext
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const response = await sendOtp(email);
    setMessage(response.message);
  };

  return (
    <div className="reset-container">
      <h2 className="reset-title">Reset your password</h2>
      <p className="reset-subtext">We will send you an email to reset your password</p>

      <form className="reset-form" onSubmit={handleSendOtp}>
        <input
          type="email"
          placeholder="Email"
          className="reset-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="reset-button">Submit</button>
      </form>

      {message && <p className="reset-message">{message}</p>}

      <button className="reset-cancel" onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
};

export default ResetPassword;
