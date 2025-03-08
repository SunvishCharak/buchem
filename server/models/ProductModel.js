import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sizes: [
    {
      size: { type: String, required: true },
      stock: { type: Number, required: true, default: 10 },
    },
  ],
  bestseller: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: true,
  },
  reviews: [ReviewSchema],
});

const ProductModel =
  mongoose.models.product || mongoose.model("product", ProductSchema);

export default ProductModel;
