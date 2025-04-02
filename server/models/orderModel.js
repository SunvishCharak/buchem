import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: false }, // Add size support
  customization: { type: Object, required: false }, // Add customization support
});


const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Date, default: Date.now },
  awbNumber: { type: String, required: false },
});

const orderModel =
  mongoose.models.order || mongoose.model("Order", orderSchema);

export default orderModel;
