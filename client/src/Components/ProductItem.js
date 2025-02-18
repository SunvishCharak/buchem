import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "../Styles/ProductItem.css";

const ProductItem = ({ image, name, price, className }) => {
  const { currency, products } = useContext(ShopContext);
  const productSlug = name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      className={`product-item-container container ${className || ""}`}
      to={`/product/${productSlug}`}
    >
      <div className="product-item-image-wrapper">
        <img
          className={`product-item-image ${
            className ? `${className}-image` : ""
          }`}
          src={image[0]}
          alt={name}
        />
      </div>
      <p className="product-item-name">{name}</p>
      <p className="product-item-price">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
