import React from "react";
import "../Styles/ShippingPolicy.css";

const ShippingPolicy = () => {
  return (
    <div className="shipping-policy-container">
      <h1>Shipping Policy</h1>
      
      <section className="policy-section">
        <h2>Our Commitment</h2>
        <p>
          At Buchem, we believe that the feeling of luxury through fashion should be accessible to all. 
          That’s why we offer not only high-quality, stylish apparel but also a seamless and hassle-free shopping experience.
        </p>
        <p>
          Our shipping policy is designed to ensure that your order arrives quickly, safely, and affordably, no matter where you are.
          We strive to deliver your luxury pieces with care, so you can enjoy the elevated experience of our brand from the moment 
          your order is placed to the moment it reaches your doorstep.
        </p>
      </section>
      
      <section className="policy-section">
        <h2>Shipment Processing Time</h2>
        <p>
          All orders are processed within <strong>6-9 working days</strong>, depending upon the product you have ordered. 
          For large order quantities, processing time may vary.
        </p>
      </section>

      <section className="policy-section">
        <h2>Shipping Charges</h2>
        <p>
          <strong>For orders below Rs.2000</strong>: Standard shipping charges of Rs.100 will apply.
        </p>
        <p>
          <strong>For orders above Rs.2000</strong>: Free shipping.
        </p>
        <p>
          <strong>Express Shipping</strong>: Available at checkout with a delivery charge of Rs.200.
        </p>
      </section>

      <section className="policy-section">
        <h2>Shipment Confirmation & Order Tracking</h2>
        <p>
          You will receive a Shipment Confirmation email once your order has shipped, containing your tracking number(s). 
          The tracking number will be active within 24 hours.
        </p>
      </section>

      <section className="policy-section">
        <h2>Damages</h2>
        <p>
          At Buchem, we take great care in ensuring that your order is carefully packed and leaves our facility in perfect condition. 
          However, once your package is in the hands of the courier, any damage that may occur during transit is beyond our control.
        </p>
        <p className="note">
          If you notice any damages, please contact the courier service directly to initiate a claim.
        </p>
      </section>
      
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>If you have any questions, contact us at <a href="mailto:buchemindia@gmail.com">buchemindia@gmail.com</a> or DM us on WhatsApp.</p>
      </section>
    </div>
  );
};

export default ShippingPolicy;


