import React, { createContext, useContext, useEffect, useState } from "react";
import { login, signup, logout, refreshToken, sendOtp, verifyOtp } from "../api/auth";
import axios from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // store logged user
  const [loading, setLoading] = useState(true); // initial page loading
  const [isAuthLoading, setIsAuthLoading] = useState(false); // login/signup loading

  // -----------------------------
  // Auto-load user on refresh
  // -----------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // -----------------------------
  // LOGIN
  // -----------------------------
  const handleLogin = async (data) => {
    try {
      setIsAuthLoading(true);

      const res = await login(data);

      const { user, accessToken } = res.data;

      // Save user + token
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);

      // Set Axios Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setUser(user);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err); // Log the error
      return { success: false, message: err?.response?.data?.message || "Login failed" };
    } finally {
      setIsAuthLoading(false);
    }
  };

  // -----------------------------
  // SIGNUP
  // -----------------------------
  const handleSignup = async (data) => {
    try {
      setIsAuthLoading(true);
      await signup(data);
      return { success: true, message: "OTP sent to your email." };
    } catch (err) {
      console.error("Signup failed:", err);
      return { success: false, message: err?.response?.data?.message || "Signup failed" };
    } finally {
      setIsAuthLoading(false);
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // ignore error
    }

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = "/login";
  };

  // -----------------------------
  // Refresh token (optional)
  // -----------------------------
  const refresh = async () => {
    try {
      const res = await refreshToken();
      localStorage.setItem("accessToken", res.data.accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
      return true;
    } catch {
      handleLogout();
      return false;
    }
  };

  const isLoggedIn = !!user;

  // -----------------------------
  // VERIFY OTP
  // -----------------------------
  const handleVerifyOtp = async (data) => {
    try {
      setIsAuthLoading(true);
      const res = await verifyOtp(data);
      const { user, accessToken } = res.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(user);

      return { success: true };
    } catch (err) {
      console.error("OTP Verification failed:", err);
      return { success: false, message: err?.response?.data?.message || "OTP Verification failed" };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthLoading,
    handleLogin,
    handleSignup,
    handleLogout,
    handleVerifyOtp,
    refresh,
    isLoggedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Easy hook
export const useAuth = () => useContext(AuthContext);
