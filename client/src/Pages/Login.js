import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Login.css";
import { ShopContext } from "../context/ShopContext.js";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Sign Up");
  const location = useLocation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          const redirectPath = location.state?.from || "/";
          navigate(redirectPath);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath);
    }
  }, [token, navigate, location]);

  return (
    <form onSubmit={onSubmitHandler} className="form-container container">
      <div className="login-header">
        <p className="section-title">{currentState}</p>
        <hr className="header-line" />
      </div>
      {currentState === "Sign Up" &&  (
        
      
        
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name"
          required
          className="input-field"
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Enter your email"
        required
        className="input-field"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Enter your password"
        required
        className="input-field"
      />

      {currentState  === "Sign Up" && (

      <input
      onChange={(e) => setConfirmPassword(e.target.value)}
      value={confirmPassword}
      type="password"
      placeholder="Confirm Password"
      required
      className="input-field"
      />

      )}
      
      <div className="options">
        <p className="forgot-password" onClick={() => navigate("/reset-password")}>Forgot your password?</p>

        </div>
        <button className="submit-button">
        {currentState === "Login" ? "Sign In" : "Sign up"}
        </button> 
         {/* Create Account button (only in Login mode, below Sign In) */}
        {currentState === "Login" && (
        
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="toggle-state"
          >
            Create account
          </p>
        )}
        
        {currentState === "Sign Up" && (
          <p onClick={() => setCurrentState("Login")} className="toggle-state">
            Login Here
          </p>
        )}

    </form>
  );
};

export default Login;