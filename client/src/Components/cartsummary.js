import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const CartSummary = ({cartData}) => {
  const { currency, getCartAmount, delivery_fee } = useContext(ShopContext);

  if(cartData.length === 0) {
    return null;
  }

  return (
    <div className="cart-summary">
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

      {/* Total */}
      <div className="cart-row cart-total">
        <b>Total</b>
        <b>
          {currency} {getCartAmount() + delivery_fee}.00
        </b>
      </div>
    </div>
  );
};

export default CartSummary;
