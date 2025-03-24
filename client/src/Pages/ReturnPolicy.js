import React from "react";
import "../Styles/ReturnPolicy.css";

const ReturnPolicy = () => {
  return (
    <div className="return-policy-container">
      <h1>Thanks for Shopping at Buchem</h1>
      
      <section className="policy-section">
        <h2>Return Policy</h2>
        <p>
          Products purchased in any kind of <strong>SALE</strong> are not available for return. Only size exchange is available if the product is in stock. Please order accordingly.
        </p>
        <p>
          If your item has all tags and labels attached, remains unworn, unwashed, unsoiled, and is within our <strong>7-day return period</strong>, you may return it. Once we inspect the returned item, we will process your refund as store credit or exchange.
        </p>
        <p>
          A nominal return fee of <strong>Rs.100</strong> will be charged to cover handling and logistics. Store credit will reflect in the <strong>"My Account"</strong> section and can be used for future purchases. <strong>Second-time returns are not available.</strong>
        </p>
        <p className="note">Items that have been worn, washed, or returned without tags will not be eligible for a refund or exchange.</p>
      </section>
      
      <section className="policy-section">
        <h2>Refund Policy</h2>
        <p>
          We do not offer refunds. Instead, we provide <strong>store credit</strong> for returns. A return fee of ₹100 will be charged, and store credit (valid for 3 months) will be issued upon approval.
        </p>
        <p className="note">Order cancellation is not available under any circumstances.</p>
      </section>

      <section className="policy-section">
        <h2>Exchange Policy</h2>
        <p>
          We offer <strong>free size exchange</strong> if the item has all tags attached, remains unworn, unwashed, and is within our <strong>7-day exchange period</strong>.
        </p>
        <p>
          If you exchange a product for the second time, a fee of <strong>Rs.250</strong> will be charged.
        </p>
      </section>
      
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>If you have any questions, contact us at <a href="mailto:buchemindia@gmail.com">buchemindia@gmail.com</a> or DM us on WhatsApp.</p>
      </section>
    </div>
  );
};

export default ReturnPolicy;
