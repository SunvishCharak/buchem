import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import nodemailer  from "nodemailer";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or App Password
  },
});


// Route for user registration

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // to check if the user already exists
    const exists = await UserModel.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User already exists" });
    // to check if the email is valid
    if (!validator.isEmail(email))
      return res.json({
        success: false,
        message: "Invalid email! Please enter a valid email",
      });

    if (password.length < 8)
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });

    // to hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const NewUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const User = await NewUser.save();

    const token = createToken(User._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error.message" });
  }
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // to check if the user exists
    const user = await UserModel.findOne({ email });

    if (!user)
      return res.json({ success: false, message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error.message" });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get User Wishlist
const getUserWishlist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate("wishlist");
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate("orders");
    res.json({ success: true, orders: user.orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get User Addresses
const getUserAddresses = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { loginUser, registerUser, adminLogin, getUserAddresses,getUserOrders, getUserWishlist,getUserProfile, };
