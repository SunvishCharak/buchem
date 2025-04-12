import React, { useContext, useEffect } from "react";
import CartTotal from "../Components/CartTotal";
import { assets } from "../Assets/assets";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import "../Styles/Checkout.css";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    products,
    delivery_fee,
    handleOrderSuccess,
  } = useContext(ShopContext);

  const location = useLocation();
  const nav = useNavigate();

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      receipt: order.receipt,
      handler: async function (response) {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyrazorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/orders");
            handleOrderSuccess();
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product.name === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      console.log("Order Items:", orderItems);
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      const responseRazorpay = await axios.post(
        backendUrl + "/api/order/razorpay",
        orderData,
        { headers: { token } }
      );
      if (responseRazorpay.data.success) {
        initPay(responseRazorpay.data.order);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      nav("/login", { state: { from: location.pathname } });
    }
  }, [token, nav, location]);

  return (
    <form onSubmit={onSubmitHandler} className="checkout-container container">
      <div className="delivery-info">
        <h2 className="section-subtitle">Contact</h2>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Enter your email address"
          className="input-field"
        />
        <p className="contact-text">
          You will receive text messages & emails related to order confirmation
          and shipping updates.
        </p>
        <h2 className="section-subtitle">Delivery Address</h2>
        <div className="name-fields">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder="First Name"
            className="input-field"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
            className="input-field"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder="Street Address"
          className="input-field"
        />

        <input
          required
          onChange={onChangeHandler}
          name="landmark"
          value={formData.landmark}
          type="text"
          placeholder="landmark"
          className="input-field"
        />

        <div className="address-fields">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="input-field"
          />

          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="input-field"
          />
        </div>
        <div className="address-fields">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder="Zip Code"
            className="input-field"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="input-field"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="number"
          placeholder="Phone Number"
          className="input-field"
        />
      </div>
      <div className="payment-container">
        <div className="cart-total-container">
          <CartTotal />
        </div>
        <div className="place-order">
          <button type="submit" className="order-btn">
            Proceed to Pay
          </button>
        </div>
      </div>
    </form>
  );
};

export default Checkout;
