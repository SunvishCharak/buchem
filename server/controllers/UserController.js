import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModal from "../models/UserModel.js";
import ProductModal from "../models/ProductModel.js";
import nodemailer from "nodemailer";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user registration

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await UserModal.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User already exists" });

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

    const NewUser = new UserModal({
      name,
      email,
      password: hashedPassword,
    });

    const User = await NewUser.save();

    const token = createToken(User._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModal.findOne({ email });

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

// Get User Account Information
const getUserAccount = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res
        .status(401)
        .json({ success: false, message: "User ID not found" });
    }

    // Fetch the user data excluding the password field
    const user = await UserModal.findById(req.body.userId).select("-password");

    if (!user) {
      console.error("No user found with this ID:", req.body.userId);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error in getUserAccount:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { itemId, userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is missing" });
    }

    const user = await UserModal.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.wishlist.includes(itemId)) {
      user.wishlist.push(itemId);
      await user.save();
    }

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { itemId, userId } = req.body;

    const user = await UserModal.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((item) => item.toString() !== itemId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error in removeFromWishlist:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get User Wishlist
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await UserModal.findById(userId).populate("wishlist");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const products = await ProductModal.find({ _id: { $in: user.wishlist } });

    res.json({ success: true, wishlist: products });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Wallet: Redeem balance
const redeemWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await UserModal.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (amount > user.wallet.balance) {
      return res.json({ success: false, message: "Insufficient balance." });
    }
    user.wallet.balance -= amount;
    await user.save();
    res.json({ success: true, balance: user.wallet.balance });
  } catch (error) {
    console.error("Error redeeming wallet balance:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Wallet: Credit balance
const creditWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await UserModal.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.wallet.balance += amount;
    await user.save();
    res.json({ success: true, balance: user.wallet.balance });
  } catch (error) {
    console.error("Error crediting wallet balance:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModal.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL, // Use your email
        pass: process.env.ADMIN_PASSWORD, // Use your email app password
      },
    });

    const mailOptions = {
      from: "process.env ADMIN_EMAIL",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModal.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "OTP verified. Proceed to reset password." });

  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await UserModal.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now log in." });

  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};






export {
  loginUser,
  registerUser,
  adminLogin,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getUserAccount,
  redeemWallet,
  creditWallet,
  sendOTP,
  verifyOTP,
  resetPassword,
};
