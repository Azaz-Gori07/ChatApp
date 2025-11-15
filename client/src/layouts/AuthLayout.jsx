import React from "react";
import "./AuthLayout.css";

const AuthLayout = ({ children, title = "Welcome" }) => {
  return (
    <div className="auth-layout">
      <div className="auth-box">
        <h2 className="auth-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
