import React from "react";
import "../Styles/NewsLetter.css";

const NewsLetter = () => {
  return (
    <section className="newsletter container " id="newsletter">
      <h3 className="newsletter-heading">Sign Up & Save</h3>
      <p className="newsletter-text">
        Subscribe to our newsletter to get the latest updates on new products
        and promotions.
      </p>
      <form className="newsletter-form">
        <div className="input-container">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email"
          />
          <button type="submit" className="newsletter-icon">
            <i className="uil uil-envelope"></i>
          </button>
        </div>
      </form>

      {/*socila media icons */}
      <div className="social-icons">
        <i className="uil uil-instagram"></i>
        <i className="uil uil-facebook"></i>
        <i className="uil uil-youtube"></i>
        <i className="uil uil-twitter"></i>
        <i className="uil uil-pinterest"></i>
        <i className="uil uil-linkedin"></i>
      </div>
    </section>
  );
};

export default NewsLetter;
