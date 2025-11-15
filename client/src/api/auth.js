import axios from "./axiosInstance";

export const signup = async (data) => {
  return axios.post("/auth/signup", data);
};

export const login = async (data) => {
  return axios.post("/auth/login", data);
};

export const refreshToken = async () => {
  return axios.get("/auth/refresh");
};

export const logout = async () => {
  return axios.post("/auth/logout");
};

export const sendOtp = async (data) => {
  return axios.post("/auth/send-otp", data);
};

export const verifyOtp = async (data) => {
  return axios.post("/auth/verify-otp", data);
};
