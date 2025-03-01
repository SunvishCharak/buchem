import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Styles/Wallet.css";
import { ShopContext } from "../context/ShopContext";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");

  const {backendUrl} = useContext(ShopContext);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/wallet/balance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBalance(res.data.balance || 0);
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      setTransactions([]);
    }
  };

  const addMoney = async () => {
    if (amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/wallet/add-money`,
        { amount, paymentMethod: "Google Pay" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      fetchWalletBalance();
      alert("Money added successfully!");
    } catch (error) {
      console.error("Error adding money:", error);
    }
  };

  return (
    <div className="wallet-container">
      <h3 className="wallet-balance">Wallet Balance: ₹{balance}</h3>
      <input
       className="enter-amount-tab"
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="wallet-actions">
      <button className= "wallet-button add-money" onClick={addMoney}>Add Money</button>
      </div>

      <h3 className="transaction-history">Transaction History</h3>
      <ul>
        {transactions?.map((tx, index) => (
          <li key={index}>
            {tx.type === "credit" ? "➕" : "➖"} ₹{tx.amount} via {tx.paymentMethod}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wallet;
