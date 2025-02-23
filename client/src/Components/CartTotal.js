import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const CartTotal = () => {
  const { cart, currency } = useContext(ShopContext);

  if (!cart || cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  // Calculate Total Price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-summary">
      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <img 
            src={item.image} 
            alt={item.name} 
            className="cart-item-image"
          />
          <p>{item.name}</p>
          <p>Size: {item.size}</p>
          <p>Qty: {item.quantity}</p>
          <p>{currency}{item.price * item.quantity}</p>
        </div>
      ))}
      <div className="cart-total">
        <strong>Total: {currency}{totalPrice}</strong>
      </div>
    </div>
  );
};

export default CartTotal;
