import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CouponModel = mongoose.model("Coupon", CouponSchema);
export default CouponModel;
