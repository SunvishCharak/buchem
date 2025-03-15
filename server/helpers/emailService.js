import nodemailer from "nodemailer";
import dotenv from "dotenv";
import OTP from "../models/OtpModel.js";

dotenv.config();

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOTP();
    await OTP.deleteOne({ email });

    // Store OTP in MongoDB
    const newOTP = new OTP({ email, otp });
    await newOTP.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    });

    return res.json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending OTP." });
  }
};

// function to verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const storedOTP = await OTP.findOne({ email });

    if (!storedOTP) {
      return { success: false, message: "OTP expired or invalid" };
    }

    if (storedOTP.otp !== otp) {
      return { success: false, message: "Incorrect OTP" };
    }

    // OTP is valid, delete it from database
    await OTP.deleteOne({ email });

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Error verifying OTP" };
  }
};
