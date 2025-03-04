import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import "../Styles/CartTotal.css";

const CartTotal = () => {
  const { currency, getCartAmount, delivery_fee, cartItems, products } =
    useContext(ShopContext);

    

  // Helper function to get product details by ID
  const getProductDetails = (itemId) => {
    return products.find((product) => product.name === itemId);
  };

    // Filter out products where all sizes have quantity 0
    const filteredCartItems = Object.keys(cartItems).filter((itemId) => 
       Object.values(cartItems[itemId]).some((quantity) => quantity > 0)
    );

  return (
    <div className="cart-total-container container">
      <h2 className="section-title">Cart Total</h2>
      <div className="cart-total-content">
        {/* Loop through the cart items
        {Object.keys(cartItems).map((itemId) => {
          const product = getProductDetails(itemId); */}

          {filteredCartItems.length === 0 ? (
            <p className="empty-cart-message"></p>
          ):(
            filteredCartItems.map((itemId)=>{
              const product = getProductDetails(itemId);
            
          
      

          if(!product){
            return(
              <div className="cart-item-checkout" key={itemId}>
                <p className="error-message">Product not found</p>
              </div>
            );
          }
          return (
            <div className="cart-item-checkout" key={itemId}>
              {/* Product Image */}
              <div className="cart-item-checkout-image">
                <img src={product.image[0]} alt={product.name} />
              </div>
              {/* Product Details */}
              <div className="cart-item-detail">
                <p className="cart-item-checkout-name">{product.name}</p>
               
                <p className="cart-item-checkout-size">
                  Size: {Object.keys(cartItems[itemId]).join(", ")}
                </p>
                <p className="cart-item-checkout-quantity">
                  Quantity: {Object.values(cartItems[itemId]).reduce((a, b) => a + b, 0)}
                </p>
              </div>
              <p className="cart-item-checkout-price">
                  {currency} {product.price}
                </p>
            </div>
          );
        })
      )}

        {filteredCartItems.length > 0 && (
          <>

        <hr />
        {/* Subtotal */}
        <div className="cart-row">
          <p>Subtotal</p>
          <p>
            {currency} {getCartAmount()}.00
          </p>
        </div>
        <hr />
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
        </>
        )}
      </div>
    
    </div>
  );
};

export default CartTotal;
