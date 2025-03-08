import React from "react";
import "../Styles/Footer.css";
import Logo from "./Logo.js";
import { Link } from "react-router-dom";
import NewsLetter from "../Components/NewsLetter.js";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-column">
          <a href="/" className="nav-logo footer-logo">
            <Logo />
          </a>
          <p>
            Discover the latest trends in fashion at Buchem.Shop a wide range of
            stylish clothing, accessories, and footwear for women.
          </p>
        </div>

        <div className="footer-column">
          <h2 className="footer-title">Shop</h2>
          <ul className="footer-list">
            <li>
              <Link to="/products?new-arrivlas" className="footer-link">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/products?category=dress" className="footer-link">
                Dress
              </Link>
            </li>
            <li>
              <Link to="/products?category=Top" className="footer-link">
                Top
              </Link>
            </li>
            <li>
              <Link to="/products?category=co-ords" className="footer-link">
                Co-ords
              </Link>
            </li>
            <li>
              <Link to="/products?category=skirts" className="footer-link">
                Skirt
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h2 className="footer-title">Help</h2>
          <ul className="footer-list">
            <li>
              <Link to="/contact" className="footer-link">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/return-policy" className="footer-link">
                Return Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="footer-link">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link"></Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h2 className="footer-title">Contact</h2>
          <ul className="footer-list">
            <li>Email: emailid@example.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Address: India</li>
          </ul>
        </div>
      </div>
      <NewsLetter />
      <div className="footer-copy container">
        &#169;2025 Buchem. All rights reserved{" "}
      </div>
    </footer>
  );
};

export default Footer;
