import { REGEX } from "./constants";

export const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!REGEX.EMAIL.test(email)) return "Invalid email format";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name is too short";
  return null;
};
