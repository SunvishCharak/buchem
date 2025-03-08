import React from "react";
import "../Styles/Hero.css";
import Banner from "../Assets/Banner.jpg";

const HeroSection = () => {
  return (
    <section className="hero-section " id="main">
      <div className="hero-image">
        <img src={Banner} alt="Slide 1" className="hero-slide-image" />
      </div>
    </section>
  );
};

export default HeroSection;
