import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      type: { type: String, enum: ["credit", "debit"], required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      paymentMethod: { type: String, required: true }, // UPI, Card, etc.
    },
  ],
});

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet; 

// module.exports = mongoose.model("Wallet", walletSchema);
