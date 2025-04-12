import React, { useState, useEffect, useContext} from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import "../Styles/CartTotal.css";
import { toast } from "react-toastify";

const CartTotal = () => {
  const {
    backendUrl,
    currency,
    getCartAmount,
    delivery_fee,
    cartItems,
    products,
    applyCoupon,
    discount,
    getFinalAmount,
    zipcode
  } = useContext(ShopContext);


  const [deliveryCharges, setDeliveryCharges] = useState(0);

 const fetchShippingCharge = async () => {
  if (!zipcode || zipcode.length !== 6 || !/^\d{6}/.test(zipcode)) return;

  try {
    const response = await axios.get(
      `${backendUrl}/api/order/shipping-charges?zipcode=${zipcode}`
    );
    const price = response.data?.data?.[0]?.rate || 0;
    setDeliveryCharges(price);
   // setShippingCharge(price);
  } catch (error) {
    console.error("Error fetching shipping charge:", error);
    toast.error("Could not fetch shipping charges");
  }
};

useEffect(() => {
  if (zipcode.length === 6) {
    fetchShippingCharge();
  }
}, [zipcode]);


// useEffect(() => {
//   if (zipcode.length === 6) {
//     fetch(`/api/shipping?zipcode=${zipcode}`)
//       .then((res) => res.json())
//       .then((data) => setDeliveryCharges(data.shippingCharge))
//       .catch((err) => console.error(err));
//   }
// }, [zipcode]);

  const [couponCode, setCouponCode] = useState("");

  // Helper function to get product details by ID
  const getProductDetails = (itemId) => {
    return products.find((product) => product.name === itemId);
  };

  const filterCartItems = Object.keys (cartItems).filter((itemID) =>
  Object.values(cartItems[itemID]).some((quantity) => quantity > 0)
);

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
        {/* Loop through the cart items
        {Object.keys(cartItems)?.map((itemId) => {
          const product = getProductDetails(itemId); */}

          {filterCartItems.length === 0 ? (
            <p className="empty-cart-message"></p>

          ):(
            filterCartItems.map((itemId)=> {
              const product = getProductDetails(itemId);

              if(!product){
                return(
                  <div className="cart-item-checkout" key={itemId}>
                    <p className="error-message">Product not found</p>
          
                  </div>
                );
              };
            

          
          return (
            <div className="cart-item-checkout" key={itemId}>
              {/* Product Image */}
              <div className="cart-item-checkout-image">
                <img src={product?.image[0]} alt={product?.name} />
              </div>
              {/* Product Details */}
              <div className="cart-item-detail">
                <p className="cart-item-checkout-name">{product?.name}</p>

                
                <p className="cart-item-checkout-price">
                  {currency} {product .price}
                </p>
                
                <p className="cart-item-checkout-size">
                  Size: {Object.keys(cartItems[itemId]).map((sizeKey) => {
                    const item = cartItems[itemId][sizeKey];

                    if (typeof item === "object" && item.customSize) {
                      const custom = item.customSize;
                      return (
                        <span key={sizeKey}>
                          Custom - Bust: {custom.Bust}, Waist: {custom.waist}, Hips: {custom.hips}, Height: {custom.Height}
                        </span>
                      );
                    } else {
                      return <span key={sizeKey}>{sizeKey}</span>
                  }
                  }) }
                </p>

                <p className="cart-item-checkout-quantity">
                Quantity: {
                Object.entries(cartItems[itemId]).map(([sizeKey, item]) => {
               if (typeof item === "object") {
               return `${item.quantity}`;
               } else {
               return `${item}`;
               }
               }).reduce((a, b) => Number(a) + Number(b), 0)
              }
                  {/* Quantity:{" "}
                  {Object.values(cartItems[itemId]).reduce((a, b) => a + b, 0)} */}
                </p>
              </div>
            </div>
          );
        })
      )}

      { filterCartItems.length > 0 && (
        <>

        

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
            {currency} {deliveryCharges}
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
        </>
      )}
      </div>
    </div>
  );
};

export default CartTotal;
