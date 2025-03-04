import React, { useState, useContext } from "react";
import Wishlist from "./wishlist";
// import Orders from "./Orders";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "../Styles/MyProfile.css"; // Import the CSS file
import Wallet from "../Components/Wallet";

const ProfilePage = () => {
  
  const { user, setUser } = useContext(ShopContext); // Get user data from context
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

   // Logout function
   const handleLogout = () => {
    localStorage.removeItem("token"); // Clear stored authentication token
    setUser(null); // Reset user state in context
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="profile-container container">
      {user ? (
        <div className="profile-content container">
          <div className="profile-header">
          {/* <i class="uis uis-user-circle"></i> */}
            <div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Replacing MUI Tabs with buttons */}
          <div className="tab-buttons">
            <button 
              className={`tab-button ${tabIndex === 0 ? "active" : ""}`} 
              onClick={() => setTabIndex(0)}
            >
              Wishlist
            </button>
            {/* <button 
              className={`tab-button ${tabIndex === 1 ? "active" : ""}`} 
              onClick={() => setTabIndex(1)}
            >
              Orders
            </button> */}

            <button 
              className={`tab-button ${tabIndex === 1 ? "active" : ""}`} 
              onClick={() => setTabIndex(1)}
            >
              Wallet
            </button>
          
          </div>

          <div className="tab-content">
            {tabIndex === 0 && <Wishlist smallView={true}/>}
            {/* {tabIndex === 1 && <Orders />} */}
            {tabIndex === 1 && <Wallet balance={user.walletBalance || 0}/>}
          </div>

        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
