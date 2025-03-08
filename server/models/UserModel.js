import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {},
    },
    wallet: {
      type: Number,
      default: 0,
      min: 0,
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    returnOrders: {
      type: Array,
      default: [],
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
  { minimize: false }
);

const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);

export default UserModel;
