import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import "../Styles/CartTotal.css";
import { toast } from "react-toastify";

const CartTotal = () => {
  const {
    currency,
    getCartAmount,
    delivery_fee,
    cartItems,
    products,
    applyCoupon,
    discount,
    getFinalAmount,
  } = useContext(ShopContext);

  const [couponCode, setCouponCode] = useState("");

  // Helper function to get product details by ID
  const getProductDetails = (itemId) => {
    return products.find((product) => product.name === itemId);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode);
    } else {
      toast.error("Please enter a valid coupon code");
    }
  };

  return (
    <div className="cart-total-container container">
      <h2 className="section-title">Cart Total</h2>
      <div className="cart-total-content">
        {/* Loop through the cart items */}
        {Object.keys(cartItems).map((itemId) => {
          const product = getProductDetails(itemId);
          return (
            <div className="cart-item-checkout" key={itemId}>
              {/* Product Image */}
              <div className="cart-item-checkout-image">
                <img src={product.image[0]} alt={product.name} />
              </div>
              {/* Product Details */}
              <div className="cart-item-detail">
                <p className="cart-item-checkout-name">{product.name}</p>
                <p className="cart-item-checkout-price">
                  {currency} {product.price}
                </p>
                <p className="cart-item-checkout-size">
                  Size: {Object.keys(cartItems[itemId]).join(", ")}
                </p>
                <p className="cart-item-checkout-quantity">
                  Quantity:{" "}
                  {Object.values(cartItems[itemId]).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
          );
        })}

        <hr />
        {/* Subtotal */}
        <div className="cart-row">
          <p>Subtotal</p>
          <p>
            {currency} {getCartAmount()}.00
          </p>
        </div>
        
        {/* Shipping Fee */}
        <div className="cart-row">
          <p>Shipping</p>
          <p>
            {currency} {delivery_fee}
          </p>
        </div>

        {/* Coupon Code Input */}
        {/* <div className="coupon-section">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button onClick={handleApplyCoupon}>Apply Coupon</button>
        </div>

        {discount > 0 && (
          <div className="cart-row">
            <p>Discount</p>
            <p>
              {" "}
              - {currency} {discount}.00
            </p>
          </div>
        )} */}

        {/* Total */}
        <div className="cart-row cart-total">
          <b>Total</b>
          <b>
            {currency} {getFinalAmount()}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
