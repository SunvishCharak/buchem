import React, { useState } from "react";
import { backendUrl } from "../App.js";
import axios from "axios";
import { toast } from "react-toastify";
import "../Styles/Login.css"; // Import the CSS file

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="form-group">
            <p className="form-label">Email Address</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-input"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <p className="form-label">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="form-input"
              type="password"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
