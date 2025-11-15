import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.OTP_EMAIL,
    pass: ENV.OTP_EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: ENV.OTP_EMAIL,
    to: email,
    subject: "Your OTP for Chat App Verification",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Chat App Email Verification</h2>
        <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #007BFF;">${otp}</p>
        <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <hr>
        <p style="font-size: 12px; color: #777;">This is an automated message. Please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending OTP email to ${email}:`, error);
    return false;
  }
};
