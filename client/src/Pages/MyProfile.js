import React, { useState, useContext } from "react";
import Wishlist from "./wishlist";
import Orders from "./Orders";
import { ShopContext } from "../context/ShopContext";
import "../Styles/MyProfile.css"; // Import the CSS file

const ProfilePage = () => {
  const { user } = useContext(ShopContext); // Get user data from context
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-content">
          <div className="profile-header">
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="profile-image"
            />
            <div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
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
            <button 
              className={`tab-button ${tabIndex === 1 ? "active" : ""}`} 
              onClick={() => setTabIndex(1)}
            >
              Orders
            </button>
          </div>

          <div className="tab-content">
            {tabIndex === 0 && <Wishlist smallView={true}/>}
            {tabIndex === 1 && <Orders />}
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
