import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, ENV.REFRESH_SECRET, { expiresIn: "7d" });
};
