import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import UserModel from "../models/UserModel.js";




// nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,   
  },
});

// Middleware to authenticate user using JWT token
export const protect = async (req, res, next) => {
  let token;

  // Ensure authorization header is present and correctly formatted
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await UserModel.findById(decoded.id).select("-password"); // Exclude password from user data
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      next(); // Proceed to the next middleware
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token, authorization failed" });
    }
  } else {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

export const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



