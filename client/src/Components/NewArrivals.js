import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../Components/ProductItem";
import "../Styles/NewArrivals.css";
import { useNavigate } from "react-router-dom";

const NewArrivals = () => {
  const { products } = useContext(ShopContext);
  const [NewArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    setNewArrivals(products.slice(0, 12));
  }, [products]);

  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/products");
  };

  return (
    <section className="new-arrivals section" id="new-arrivals">
      <div className="new-arrivals-container container">
        <div className="new-arrivals-title">
          <h2 className="section-title">New Arrivals</h2>
        </div>

        <div className="new-arrivals-grid">
          {NewArrivals.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              className="new-arrivals-product"
            />
          ))}
        </div>
        <div className="new-arrivals-btn">
          <button className="view-all-btn" onClick={handleViewAll}>
            View All
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
