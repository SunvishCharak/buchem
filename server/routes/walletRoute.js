const express = require("express");
const Wallet = require("../models/walletModel");
const authMiddleware = require("../middleware/auth"); // Middleware for authentication
const router = express.Router();

// 🟢 Fetch User Wallet Balance
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user.id, balance: 0 });
    }

    res.json({ balance: wallet.balance, transactions: wallet.transactions });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🟢 Add Money to Wallet
router.post("/add-money", authMiddleware, async (req, res) => {
  const { amount, paymentMethod } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      wallet = new Wallet({ userId: req.user.id, balance: 0, transactions: [] });
    }

    wallet.balance += amount;
    wallet.transactions.push({ type: "credit", amount, paymentMethod });

    await wallet.save();
    res.json({ message: "Money added successfully", balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🟢 Deduct Money from Wallet (For Purchases)
router.post("/deduct-money", authMiddleware, async (req, res) => {
  const { amount } = req.body;

  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    wallet.balance -= amount;
    wallet.transactions.push({ type: "debit", amount, paymentMethod: "wallet" });

    await wallet.save();
    res.json({ message: "Payment successful", balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
