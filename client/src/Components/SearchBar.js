import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.js";
import { assets } from "../Assets/assets.js";
import "../Styles/SearchBar.css";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState(search);
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearch(searchTerm);
      setShowSearch(false);
      navigate(`/products?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    showSearch && (
      <div className="search-modal-overlay">
        <div className="search-modal">
          <div className="search-bar-container">
            <form onSubmit={handleSearch} className="search-input-wrapper">
              <input
                className="search-input"
                type="text"
                placeholder="Search for products or categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-button">
                <i className="uil uil-search search-icon"></i>
              </button>
            </form>
            <i
              onClick={() => setShowSearch(false)}
              className="uil uil-times close-icon"
            ></i>
          </div>
        </div>
      </div>
    )
  );
};

export default SearchBar;
