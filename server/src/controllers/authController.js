import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { ENV } from "../config/env.js";
import { sendOtpEmail } from "../services/emailService.js";

// =======================
//   SIGNUP
// =======================
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const lowercasedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: lowercasedEmail });

    if (exists && exists.isVerified) {
      return res.status(400).json({ message: "Email already exists and is verified." });
    }

    if (exists && !exists.isVerified) {
      // If user exists but is not verified, resend OTP
      await sendOtp(req, res, next);
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: lowercasedEmail,
      password: hash,
    });

    // Send OTP
    await sendOtp(req, res, next);

  } catch (err) {
    next(err);
  }
};

// =======================
//   LOGIN
// =======================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Account not verified. Please check your email for an OTP." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const accessToken = jwt.sign({ id: user._id }, ENV.JWT_SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ id: user._id }, ENV.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (err) {
    next(err);
  }
};

// =======================
//   REFRESH TOKEN
// =======================
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, ENV.REFRESH_SECRET);

    const accessToken = jwt.sign({ id: decoded.id }, ENV.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({ accessToken });

  } catch (err) {
    next(err);
  }
};

// =======================
//   LOGOUT
// =======================
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
};

// =======================
//   SEND OTP
// =======================
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const lowercasedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: lowercasedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    const emailSent = await sendOtpEmail(user.email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email." });
    }

    return res.status(200).json({ message: "OTP sent to your email address." });
  } catch (err) {
    next(err);
  }
};


// =======================
//   VERIFY OTP
// =======================
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const lowercasedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: lowercasedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or email." });
    }

    if (user.otp !== otp || user.otpExpiration < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    // Generate tokens upon successful verification
    const accessToken = jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id: user._id }, ENV.REFRESH_SECRET, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Email verified successfully.",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (err) {
    next(err);
  }
};
