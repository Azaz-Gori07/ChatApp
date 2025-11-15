import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

import { useAuth } from "./context/AuthContext";

/* ---------------------------
   Protected Route Component
---------------------------- */
const Protected = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // hide until auth loads

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

/* ---------------------------
   Router List
---------------------------- */
const RoutesList = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <Protected>
              <ChatPage />
            </Protected>
          }
        />

        <Route
          path="/profile"
          element={
            <Protected>
              <ProfilePage />
            </Protected>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default RoutesList;