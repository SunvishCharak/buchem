// import mongoose from "mongoose";

// const customizationSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//     imageUrl: { type: String, required: true },
//     customizationDetails: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Customization", customizationSchema);

import mongoose from "mongoose";

// Define Schema for Custom Requests
const customBoxSchema = new mongoose.Schema(
  {
    fields: {
      type: Map, // Flexible structure to allow any key-value pairs
      of: String, // All values are stored as strings
    },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: false } // Allow storing dynamic fields
);

const CustomBox = mongoose.model("CustomBox", customBoxSchema);
export default CustomBox;
