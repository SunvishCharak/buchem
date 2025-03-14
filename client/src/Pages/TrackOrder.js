import { useState } from "react";
import "../Styles/TrackOrder.css";

const TrackOrder = () => {
  const [awbCode, setAwbCode] = useState("");

  const handleTrack = () => {
    if (awbCode) {
      window.location.href = `https://shiprocket.co/tracking/${awbCode}`;
    } else {
      alert("Please enter an AWB Code.");
    }
  };

  return (
    <div className="track-order container">
      <h2>Track Your Order</h2>
      <p>Enter your AWB code to track your order</p>
      <input
        type="text"
        placeholder="Enter AWB Code"
        value={awbCode}
        onChange={(e) => setAwbCode(e.target.value)}
      />
      <button onClick={handleTrack}>Track Order</button>
    </div>
  );
};

export default TrackOrder;
