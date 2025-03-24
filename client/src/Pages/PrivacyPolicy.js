import React from "react";
import "../Styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      
      <section className="policy-section">
        <h2>Introduction</h2>
        <p>
          This Privacy Policy governs the manner in which Buchem (“we”, “our”, or “us”) collects, uses, maintains, and discloses information collected from users (“you”) of our website. This policy applies to all products and services offered by Buchem.
        </p>
      </section>
      
      <section className="policy-section">
        <h2>Information We Collect</h2>
        <p>
          We collect various types of information to provide a personalized and secure experience.
        </p>
        <ul>
          <li><strong>Personal Identification Information:</strong> Name, email, phone number, billing and shipping address, payment details.</li>
          <li><strong>Non-personal Identification Information:</strong> IP address, browser type, device type, operating system.</li>
          <li><strong>Cookies:</strong> Used for personalized content and improving user experience.</li>
          <li><strong>Sensitive Personal Data:</strong> Not collected unless voluntarily provided.</li>
        </ul>
      </section>
      
      <section className="policy-section">
        <h2>How We Use Your Information</h2>
        <ul>
          <li>Order fulfillment and customer support.</li>
          <li>Personalization of services and recommendations.</li>
          <li>Marketing and communication (with opt-out options).</li>
          <li>Security and fraud prevention.</li>
        </ul>
      </section>
      
      <section className="policy-section">
        <h2>How We Protect Your Information</h2>
        <p>
          We take security seriously and implement various measures to protect your personal information, ensuring it is accessed only by authorized personnel.
        </p>
      </section>
      
      <section className="policy-section">
        <h2>Sharing Your Information</h2>
        <ul>
          <li>We do not sell, rent, or trade personal data.</li>
          <li>Service providers may access data only to fulfill necessary operations.</li>
          <li>Legal compliance and business transfers may require sharing certain information.</li>
        </ul>
      </section>
      
      <section className="policy-section">
        <h2>Your Rights</h2>
        <ul>
          <li>Access and correction of personal data.</li>
          <li>Data portability and deletion requests.</li>
          <li>Opt-out from marketing communications.</li>
        </ul>
      </section>
      
      <section className="policy-section">
        <h2>Retention & International Transfers</h2>
        <p>
          We retain your data as long as necessary for our services and legal obligations. Transfers outside India follow strict data protection measures.
        </p>
      </section>
      
      <section className="policy-section">
        <h2>Children’s Privacy</h2>
        <p>
          Our website is not intended for users under 18, and we do not knowingly collect data from minors.
        </p>
      </section>
      
      <section className="policy-section">
        <h2>Changes to Privacy Policy</h2>
        <p>
          We may update this policy periodically. Continued use of our services constitutes acceptance of changes.
        </p>
      </section>
      
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>If you have any questions, reach us at <a href="mailto:buchemindia@gmail.com">buchemindia@gmail.com</a> or call us at +91 6284987504.</p>
        <p>Address: 1326, Sushant Lok, Phase 1, Sector 43, Gurgaon, Haryana, 122002</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
