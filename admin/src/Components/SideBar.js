import React from "react";
import "../Styles/SideBar.css"; // Import the CSS file
import { NavLink } from "react-router-dom";
import { assets } from "../Assets/assets";

const SideBar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-links">
        <NavLink to="/add" className="sidebar-link">
          <img className="sidebar-icon" src={assets.add_icon} alt="Add" />
          <p className="sidebar-text">Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-link">
          <img className="sidebar-icon" src={assets.order_icon} alt="Add" />
          <p className="sidebar-text">List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-link">
          <img className="sidebar-icon" src={assets.order_icon} alt="Add" />
          <p className="sidebar-text">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
