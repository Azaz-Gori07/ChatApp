import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5001,

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,

  OTP_EMAIL: process.env.OTP_EMAIL,
  OTP_EMAIL_PASS: process.env.OTP_EMAIL_PASS,

  TWILIO_SID: process.env.TWILIO_SID,
  TWILIO_AUTH: process.env.TWILIO_AUTH,
  TWILIO_PHONE: process.env.TWILIO_PHONE,

  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,

  CLIENT_URL: process.env.CLIENT_URL,
};
