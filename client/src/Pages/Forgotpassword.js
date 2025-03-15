import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../Styles/Forgotpassword.css";
import { ShopContext } from "../context/ShopContext.js";

const ForgotPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password/otp`,
        { email }
      );
      if (response.data.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password/reset`,
        {
          email,
          otp,
          newPassword,
        }
      );

      if (response.data.success) {
        toast.success("Password reset successful! Please login.");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="form-container container">
      <div className="login-header">
        <p className="section-title">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </p>
        <hr className="header-line" />
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendOtp}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <button className="submit-button">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="input-field"
          />
          <button className="submit-button">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
