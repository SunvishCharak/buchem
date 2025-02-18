import React from "react";
import "../Styles/QuantitySelector.css";

const QuantitySelector = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="quantity-selector">
      <button
        className="quantity-btn"
        onClick={onDecrease}
        disabled={quantity <= 1}
      >
        −
      </button>
      <span className="quantity-value">{quantity}</span>
      <button className="quantity-btn" onClick={onIncrease}>
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
