import React from "react";
import "../Styles/NavBar.css";

const NavBar = ({ setToken }) => {
  return (
    <div className="navbar-container">
      <img className="navbar-logo" src="Assets/blogoo.png" alt="Logo" />
      <button onClick={() => setToken("")} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default NavBar;
