import React from "react";
import "../Styles/ShippingPolicy.css"; // Import the CSS file

const ShippingPolicy = () => {
  return (
    <div className="shipping-policy-container">
      <h1>Shipping Policy</h1>
      <p>
        At <strong>Buchem</strong>, we believe that the feeling of luxury through fashion should be 
        accessible to all. That’s why we offer not only high-quality, stylish apparel but also 
        a seamless and hassle-free shopping experience.
      </p>
      <p>
        Our shipping policy is designed to ensure that your order arrives quickly, safely, and 
        affordably, no matter where you are. We strive to deliver your luxury pieces with care, 
        so you can enjoy the elevated experience of our brand from the moment your order is 
        placed to the moment it reaches your doorstep.
      </p>

      <h2>Shipment Processing Time</h2>
      <p>All orders are processed within <strong>6-9 working days</strong> depending on the product.</p>
      <p>For large order quantities, processing time may vary.</p>

      <h2>Shipping Charges</h2>
      <ul>
        <li>Orders below ₹3500: <strong>₹100 standard shipping charge</strong></li>
        <li>Orders above ₹3500: <strong>Free shipping</strong></li>
        <li>Express shipping available at checkout: <strong>₹200 charge</strong></li>
      </ul>

      <h2>Shipment Confirmation & Order Tracking</h2>
      <p>
        You will receive a <strong>Shipment Confirmation email</strong> once your order has shipped, 
        containing your tracking number(s). The tracking number will be active within 24 hours.
      </p>

      <h2>Damages</h2>
      <p>
        At <strong>Buchem</strong>, we take great care in ensuring that your order is carefully packed and 
        leaves our facility in perfect condition. However, once your package is in the hands 
        of the courier, any damage that may occur during transit is beyond our control.
      </p>
      <p>
        If you notice any damages, please contact the courier service directly to initiate a claim.
      </p>
    </div>
  );
};

export default ShippingPolicy;
