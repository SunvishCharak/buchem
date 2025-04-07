import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../Assets/assets";
import CartTotal from "../Components/CartTotal";
import QuantitySelector from "../Components/QuantitySelector.js";
import "../Styles/Cart.css";
import CartSummary from "../Components/cartsummary.js";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, setCartItems, saveCartToLocalStorage } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [orderInstructions, setOrderInstructions] = useState("");
  const [showOrderNote, setShowOrderNote] = useState(false); // Toggle dropdown
  const [openDropdown, setOpenDropdown] = useState({});

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      const cleanedCart = structuredClone(cartItems);
      let isCartModified = false;
  
      for (const productName in cartItems) {
        const productExists = products.find((p) => p.name === productName);
  
        if (!productExists) {
          // Product was deleted from the website, remove it from the cart
          delete cleanedCart[productName];
          isCartModified = true;
          continue;
        }
  
        // Now process valid product sizes
        for (const sizeKey in cartItems[productName]) {
          // Skip custom size details (we only want the quantity keys)
          if (sizeKey.includes("-details")) continue;
  
          const quantity = cartItems[productName][sizeKey];
          if (quantity > 0) {
            tempData.push({
              _id: productName, // name used as key
              size: sizeKey,
              quantity: quantity,
            });
          }
        }
      }
  
      setCartData(tempData);
  
      if (isCartModified) {
        setCartItems(cleanedCart);
        saveCartToLocalStorage(cleanedCart);
      }
    }
  }, [cartItems, products]);

  // useEffect(() => {
  //   if (products.length > 0) {
  //     const tempData = [];
  //     for (const items in cartItems) {
  //       for (const item in cartItems[items]) {
  //         if (cartItems[items][item] > 0) {
  //           tempData.push({
  //             _id: items,
  //             size: item,
  //             quantity: cartItems[items][item],
  //           });
  //         }
  //       }
  //     }
  //     setCartData(tempData);
  //   }
  // }, [cartItems, products]);

  return (
    <div className="cart-page">
      <div className="cart-container container">
        {cartData.length === 0 ? (
          <div className="empty-cart">
            <h4>Your cart is empty</h4>
            <p>Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate("/")}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div>
              <h2 className="section-title">Your Cart</h2>
              {cartData.map((item, index) => {
                const productData = products.find(
                  (product) => product.name === item._id
                );

   
                const isCustom = item.size.startsWith("Custom-");
                const customDetails = cartItems[item._id]?.[`${item.size}-details`];

                console.log("Cart Item:", item);
                console.log("Cart Items Object:", cartItems);
                console.log("Checking cartItems[item._id]:", cartItems[item._id]);
                console.log("Checking custom size details:", cartItems[item._id]?.[`${item.size}-details`]);

                return (
                  <div key={index} className="cart-item">
                    <div className="cart-item-details">
                      <img
                        className="cart-item-image"
                        src={productData.image[0]}
                        alt=""
                      />
                      <div className="cart-item-right">
                        <div>
                          <p className="cart-item-name">{productData.name}</p>
                          <div className="cart-item-meta">
                            <p>
                              {currency}
                              {productData.price}
                            </p>
                            {/* <p className="cart-item-size">Size: {item.size}</p> */}
                            {/* <div className="cart-item-size">
                              {item.size.startsWith("Custom-") && cartItems[item._id][`${item.size}-details`] ? (
                               <div>
                                <p><strong>Custom Size:</strong></p>
                                <p>Bust: {cartItems[item._id][`${item.size}-details`].Bust}</p>
                                <p>waist: {cartItems[item._id][`${item.size}-details`].waist}</p>
                                <p>hips: {cartItems[item._id][`${item.size}-details`].hips}</p>
                                <p>Height: {cartItems[item._id][`${item.size}-details`].Height}</p>
                               </div>
                            ) : (
                                 <p><strong>Size:</strong> {item.size || "Not Selected"}</p>
                              )}
                              </div> */}

                             <div className="cart-item-size">
                             {isCustom && customDetails ? (
                              <div>
                               <p 
                               onClick={() =>
                               setOpenDropdown((prev) => ({
                               ...prev,
                              [index]: !prev[index],
                               }))
                               }
                               style={{ cursor: "pointer", fontWeight: "bold" }}
                                  >
                               Custom Size {openDropdown[index] ? "▲" : "▼"}
                              </p>
                        {openDropdown[index] && (
                         <div className="custom-size-dropdown">
                         <p>Bust: {customDetails.Bust}</p>
                         <p>Waist: {customDetails.waist}</p>
                         <p>Hips: {customDetails.hips}</p>
                         <p>Height: {customDetails.Height}</p>
                        </div>
                        )}
                        </div>
                      ) : (
                     <p><strong>Size:</strong> {item.size || "Not Selected"}</p>
                      )}
                     </div>

                          </div>
                        </div>
                        <div className="cart-item-actions">
                          <QuantitySelector
                            quantity={item.quantity}
                            onIncrease={() =>
                              updateQuantity(
                                item._id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            onDecrease={() =>
                              updateQuantity(
                                item._id,
                                item.size,
                                item.quantity - 1
                              )
                            }
                          />
                          <img
                            onClick={() =>
                              updateQuantity(item._id, item.size, 0)
                            }
                            className="cart-item-delete"
                            src={assets.bin_icon}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="cart-footer">
              <div className="order-instruction">
                <p className="order-note-toggle"
                onClick={()=> setShowOrderNote(!showOrderNote)}>
                  Add Order Note
                  {/* <span className={`dropdown-arrow ${showOrderNote ? "open" : ""}`}>&#9660;</span> */}
                  </p>

                  <div className={`order-note-container ${showOrderNote ? "open" : ""}`}>
                <input
                  type="text"
                  placeholder="Enter your note..."
                  value={orderInstructions}
                  onChange={(e) => setOrderInstructions(e.target.value)}
                  className="order-instruction-input"
                />
                 </div> 
              </div>

              <div className="cart-summary">
                <div className="cart-summary-wrapper">
                  <CartSummary />
                  <div className="cart-checkout">
                    <p>
                      Taxes, Discounts and{" "}
                      <a className="shippingpolicy" href="/shipping-policy">
                        shipping
                      </a>{" "}
                      calculated at checkout
                    </p>
                    <button
                      onClick={() => navigate("/checkout")}
                      className="cart-checkout-button"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
export default Cart;
