import React from "react";
import "../Styles/Collections.css";
import { Link } from "react-router-dom";

const Collections = () => {
  return (
    <section className="collections container" id="collections">
      <h2 className="section-title">Collections</h2>
      <div className="collections-container container grid">
        {[
          { name: "Dress", img: "dresses.webp", category: "dress" },
          { name: "Tops", img: "top.webp", category: "top" },
          { name: "Co-Ord Sets", img: "co-ord.webp", category: "co-ords" },
          { name: "Skirts", img: "skirt.webp", category: "skirts" },
        ].map(({ name, img, category }) => (
          <Link key={category} to={`/products?category=${category}`}>
            <div className="collection-card">
              <div
                className="card-image"
                style={{ backgroundImage: `url('/Assets/${img}')` }}
              ></div>
              <h3 className="card-title">{name}</h3>
            </div>
          </Link>
        ))}
      </div>
      <div className="collections-btn">
        <Link to="/products">
          <button className="view-all-btn">View All</button>
        </Link>
      </div>
    </section>
  );
};

export default Collections;
