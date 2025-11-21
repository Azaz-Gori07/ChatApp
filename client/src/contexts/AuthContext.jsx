import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';
import { API_ENDPOINTS } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState(null);

  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken);
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.ME);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { accessToken, user } = response.data;
      
      setAuthToken(accessToken);
      setAccessToken(accessToken);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, {
        name,
        email,
        password,
      });

      console.log('Signup response:', response.data); // Debug log

      // OTP verification ke liye email save karo
      setPendingEmail(email.toLowerCase().trim());
      
      return {
        success: true,
        message: response.data.message || 'Account created, check email for OTP',
        requiresOtp: true
      };
    } catch (error) {
      console.error('Signup error:', error.response?.data); // Debug log
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  // OTP verification function - FIXED
  const verifyOtp = async (email, otp) => {
    try {
      console.log('Verifying OTP for:', email, 'OTP:', otp); // Debug log

      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        email: email.toLowerCase().trim(),
        otp: otp.trim(),
      });

      console.log('OTP verification response:', response.data); // Debug log

      const { accessToken, user } = response.data;
      
      setAuthToken(accessToken);
      setAccessToken(accessToken);
      setUser(user);
      setPendingEmail(null);
      
      return { 
        success: true, 
        message: response.data.message || 'Email verified successfully!' 
      };
    } catch (error) {
      console.error('OTP verification error:', error.response?.data); // Debug log
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed',
      };
    }
  };

  // Resend OTP function - FIXED
  const resendOtp = async (email) => {
    try {
      console.log('Resending OTP to:', email); // Debug log

      const response = await api.post(API_ENDPOINTS.AUTH.SEND_OTP, {
        email: email.toLowerCase().trim(),
      });

      console.log('Resend OTP response:', response.data); // Debug log
      
      return {
        success: true,
        message: response.data.message || 'OTP sent successfully!',
      };
    } catch (error) {
      console.error('Resend OTP error:', error.response?.data); // Debug log
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resend OTP',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthToken(null);
      setAccessToken(null);
      setUser(null);
      setPendingEmail(null);
      localStorage.removeItem('accessToken');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await api.put(API_ENDPOINTS.USERS.UPDATE, updates);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      };
    }
  };

  const value = {
    user,
    accessToken,
    pendingEmail,
    login,
    signup,
    verifyOtp,
    resendOtp,
    logout,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;