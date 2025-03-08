import React, { useEffect, useState } from "react";
import Navbar from "./Components/NavBar.js";
import SideBar from "./Components/SideBar.js";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login.js";
import Add from "./Pages/Add.js";
import List from "./Pages/List.js";
import Orders from "./Pages/Orders.js";
import "./App.css";

export const backendUrl = process.env.REACT_APP_BACKEND_URL;
export const currency = "₹";
const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  return (
    <div className="app-container">
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="main-container">
            <SideBar />
            <div className="content-container">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
