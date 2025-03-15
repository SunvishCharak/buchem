// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import "../Styles/Login.css";
// import { ShopContext } from "../context/ShopContext.js";
// import { toast } from "react-toastify";
// import { useLocation } from "react-router-dom";

// const Login = () => {
//   const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
//   const [currentState, setCurrentState] = useState("Sign Up");
//   const location = useLocation();
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       if (currentState === "Sign Up") {
//         const response = await axios.post(backendUrl + "/api/user/register", {
//           name,
//           email,
//           password,
//         });
//         if (response.data.success) {
//           setToken(response.data.token);
//           localStorage.setItem("token", response.data.token);
//         } else {
//           toast.error(response.data.message);
//         }
//       } else {
//         const response = await axios.post(backendUrl + "/api/user/login", {
//           email,
//           password,
//         });
//         if (response.data.success) {
//           setToken(response.data.token);
//           localStorage.setItem("token", response.data.token);
//           const redirectPath = location.state?.from || "/";
//           navigate(redirectPath);
//         } else {
//           toast.error(response.data.message);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       const redirectPath = location.state?.from || "/";
//       navigate(redirectPath);
//     }
//   }, [token, navigate, location]);

//   return (
//     <form onSubmit={onSubmitHandler} className="form-container container">
//       <div className="login-header">
//         <p className="section-title">{currentState}</p>
//         <hr className="header-line" />
//       </div>
//       {currentState === "Login" ? (
//         ""
//       ) : (
//         <input
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           type="text"
//           placeholder="Name"
//           required
//           className="input-field"
//         />
//       )}
//       <input
//         onChange={(e) => setEmail(e.target.value)}
//         value={email}
//         type="email"
//         placeholder="Enter your email"
//         required
//         className="input-field"
//       />
//       <input
//         onChange={(e) => setPassword(e.target.value)}
//         value={password}
//         type="password"
//         placeholder="Enter your password"
//         required
//         className="input-field"
//       />
//       <div className="options">
//         <p className="forgot-password">Forgot your password?</p>
//         {currentState === "Login" ? (
//           <p
//             onClick={() => setCurrentState("Sign Up")}
//             className="toggle-state"
//           >
//             Create account
//           </p>
//         ) : (
//           <p onClick={() => setCurrentState("Login")} className="toggle-state">
//             Login Here
//           </p>
//         )}
//       </div>
//       <button className="submit-button">
//         {currentState === "Login" ? "Sign In" : "Sign Up"}
//       </button>
//     </form>
//   );
// };

// export default Login;
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Login.css";
import { ShopContext } from "../context/ShopContext.js";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Sign Up");
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // Store the OTP
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP step
  const [userEmail, setUserEmail] = useState(""); // Store email for OTP verification
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (currentState === "Sign Up" && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return; // Stop execution if passwords don't match
    }

    try {
      if (!isOtpSent) {
        // Step 1: Send OTP
        const endpoint =
          currentState === "Sign Up"
            ? "/api/user/register/otp"
            : "/api/user/login/otp/send";
        const response = await axios.post(`${backendUrl}${endpoint}`, {
          email,
        });

        if (response.data.success) {
          setIsOtpSent(true);
          setUserEmail(email);
          toast.success("OTP sent to your email!");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const endpoint =
          currentState === "Sign Up"
            ? "/api/user/register"
            : "/api/user/login/otp/verify";
        const payload =
          currentState === "Sign Up"
            ? { name, email: userEmail, password, otp }
            : { email: userEmail, otp };

        const response = await axios.post(backendUrl + endpoint, payload);

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
          navigate(location.state?.from || "/");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (token) {
      navigate(location.state?.from || "/");
    }
  }, [token, navigate, location]);

  return (
    <form onSubmit={onSubmitHandler} className="form-container container">
      <div className="login-header">
        <p className="section-title">
          {isOtpSent ? "Enter OTP" : currentState}
        </p>
        <hr className="header-line" />
      </div>

      {isOtpSent ? (
        <>
          <input
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            type="text"
            placeholder="Enter OTP"
            required
            className="input-field"
          />
          <p
            onClick={async () => {
              try {
                const response = await axios.post(
                  backendUrl +
                    (currentState === "Sign Up"
                      ? "/register/otp"
                      : "/login/otp/send"),
                  { email: userEmail }
                );
                if (response.data.success) {
                  toast.success("OTP Resent!");
                } else {
                  toast.error(response.data.message);
                }
              } catch (error) {
                console.error(error);
                toast.error("Failed to resend OTP");
              }
            }}
            className="forgot-password"
          >
            Resend OTP
          </p>
        </>
      ) : (
        <>
          {currentState === "Login" ? (
            ""
          ) : (
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
          onChange={ (e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
          className="input-field"
          />

          {currentState === "Sign Up" && (
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              required
              className="input-field"
            />

          )}

            {currentState === "Sign Up" && (
              <input
              onChange={ (e)=> setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type="password"
              placeholder="Confirm Password"
              required
              className="input-field"
              />
            )}
          
        </>
      )}

      <div className="options">
        {!isOtpSent && (
          <>
            <p
              className="forgot-password"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot your password?
            </p>
            {currentState === "Login" ? (
              <p
                onClick={() => setCurrentState("Sign Up")}
                className="toggle-state"
              >
                Create account
              </p>
            ) : (
              <p
                onClick={() => setCurrentState("Login")}
                className="toggle-state"
              >
                Login Here
              </p>
            )}
          </>
        )}
      </div>

      <button className="submit-button">
        {isOtpSent
          ? "Verify OTP"
          : currentState === "Login"
          ? "Sign In"
          : "Sign Up"}
      </button>

      <button 
      className="cancel-button" 
      onClick={() => navigate("/")} 
      type="button"
      >
      Cancel
     </button>
      
    </form>
   
  );
};

export default Login;
