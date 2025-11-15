import React, { useState } from "react";
import "./LoginPage.css";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { handleLogin, isAuthLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const result = await handleLogin(form);
    if (result.success) {
      navigate("/"); // Redirect to chat page on successful login
    } else {
      alert(result.message); // Show login error
    }
  };

  return (
    <AuthLayout title="Login">
      <form className="auth-form" onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit" disabled={isAuthLoading}>
          {isAuthLoading ? "Loading..." : "Login"}
        </button>

        <div className="auth-alt">
          <a href="/signup">Create Account</a>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;