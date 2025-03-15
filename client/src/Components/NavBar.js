import React, { useState, useEffect, useContext, Suspense, lazy } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../Styles/NavBar.css";
import Logo from "./Logo.js";
import { ShopContext } from "../context/ShopContext.js";

const SearchBar = lazy(() => import("./SearchBar.js"));

const NavBar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isShopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const {
    setShowSearch,
    showSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const [scrolling, setScrolling] = useState(false);
  const location = useLocation();
  const isAccountPage = location.pathname.startsWith ("/account");
  const isOrdersPage = location.pathname.startsWith ("/orders");
  const isWishlistPage = location.pathname.startsWith ("/wishlist");
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleShopDropdown = () => {
    setShopDropdownOpen(!isShopDropdownOpen);
  };

  return (
    <header className="header">
      {/* Announcement Bar */}
      {location.pathname === "/" && (
        <div
          className={`announcement-bar ${scrolling ? "hide-announcement" : ""}`}
        >
          <p> Limited Time Offer: Get 20% OFF on your first order! </p>
        </div>
      )}

      <nav className="nav container">
        {/* Hamburger Menu */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <i className="uil uil-bars"></i>
        </div>

        {/* Logo */}
        <div className="nav-logo">
          <NavLink to="/" className="nav-logo-link">
            <Logo />
          </NavLink>
        </div>

        {/* Icons */}
        <div className="nav-icons">
          <div
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            onClick={() => (token ? null : navigate("/login"))}
          >
            <i className="uil uil-user"></i>
            {token && isDropdownOpen && (
              <ul
                className="dropdown-menu"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <li>
                  <NavLink to="/account">My Profile</NavLink>
                </li>

                <li>
                  <NavLink to="/orders">Orders</NavLink>
                </li>
                <li onClick={logout}>Logout</li>
              </ul>
            )}
          </div>

          <NavLink to="/" className="nav-icons">
            <i
              onClick={() => setShowSearch(true)}
              className="uil uil-search"
            ></i>
          </NavLink>

          <NavLink to="/wishlist" className="nav-icons">
            <i className="uil uil-heart"></i>
          </NavLink>
          <NavLink to="/cart" className="nav-icons">
            <i className="uil uil-shopping-bag"></i>
            <p className="cart-count">{getCartCount()}</p>
          </NavLink>
        </div>
      </nav>

      {showSearch && (
        <Suspense fallback={<div>Loading...</div>}>
          <SearchBar onClose={() => setShowSearch(false)} />
        </Suspense>
      )}

      {/* Side Menu */}
      {!isAccountPage && !isOrdersPage && !isWishlistPage && ( 
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <ul className="side-menu-items">
          <div className="side-menu-top">
            <li>
              {token ? (
                <NavLink
                  to="/account"
                  className="side-menu-login"
                  onClick={toggleMenu}
                >
                  <i className="uil uil-user"></i>
                  <span className="side-menu-login-text">Account</span>
                </NavLink>
              ) : (
                <NavLink
                  to="/Login"
                  className="side-menu-login"
                  onClick={toggleMenu}
                >
                  <i className="uil uil-user"></i>
                  <span className="side-menu-login-text">Login</span>
                </NavLink>
              )}
            </li>
            <li>
              <div className="close-menu" onClick={toggleMenu}>
                &times;
              </div>
            </li>
          </div>

          <div>
            <li>
              <NavLink to="/" className="side-menu-link" onClick={toggleMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products?new-arrivlas" className="side-menu-link">
                New Arrivals
              </NavLink>
            </li>

            <li
              className="side-menu-link dropdown"
              onClick={toggleShopDropdown}
            >
              Shop
              <i
                className={`uil ${
                  isShopDropdownOpen ? "uil-minus" : "uil-plus"
                }`}
                style={{ marginLeft: "10px" }}
              ></i>
            </li>

            {isShopDropdownOpen && (
              <ul className="dropdown-content">
                <li>
                  <NavLink
                    to="/products?category=dress"
                    className="dropdown-text"
                  >
                    Dress
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/products?category=Top"
                    className="dropdown-text"
                  >
                    Top
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/products?category=skirts"
                    className="dropdown-text"
                  >
                    Skirt
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/products?category=co-ords"
                    className="dropdown-text"
                  >
                    Co-ords
                  </NavLink>
                </li>
              </ul>
            )}

            <li>
              <NavLink
                to="/Orders"
                className="side-menu-link"
                onClick={toggleMenu}
              >
                Orders
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/track-order"
                className="side-menu-link"
                onClick={toggleMenu}
              >
                Track Your Order
              </NavLink>
            </li>
          </div>
        </ul>
      </div>
      )}

      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
      {(isAccountPage || isOrdersPage || isWishlistPage) && (
        <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
          <ul className="side-menu-items">
            <div className="side-menu-top">
              <header>
                <li>
                  <div className="profile-icon">

                  </div>

                  <div className="close-menu" onClick={toggleMenu}>
                    &times;
                  </div>
                </li>
              </header>
            </div>

            <div>
              <li>
                <NavLink to="/" className="side-menu-link" onClick={toggleMenu}>
                Shop
                </NavLink>
              </li>

              <li>
                <NavLink to="/orders"
                className= "side-menu-link"
                onClick={toggleMenu}
                >
                  Orders
                </NavLink>
              </li>

              <li>
                <NavLink to = "/wishlist" 
                className="side-menu-link"
                onClick={toggleMenu}>Wishlist</NavLink>
              </li>

              <li>
                <NavLink to= "/wishlist"
                className="side-menu-link"
                onClick={toggleMenu}>Wallet</NavLink>
              </li>
            </div>
          </ul>

          <footer>
            <ul>

              <li>
              <NavLink to="/account"
                  className="side-menu-link"
                  onClick={toggleMenu}>Profile</NavLink>
              </li>

              <li className="side-menu-link"
                onClick={logout}>
                Log out
                </li>

            </ul>
          </footer>
        </div>
      )}

      {/* Overlay for closing the menu
      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>} */}
    </header>
  );
};

export default NavBar;
