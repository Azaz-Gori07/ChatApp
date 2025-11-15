import React, { useState } from "react";
import "./SignupPage.css";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { handleSignup, isAuthLoading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const result = await handleSignup(form);
    if (result.success) {
      navigate("/"); // Redirect to chat page on successful signup
    } else {
      alert(result.message); // Show signup error
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form className="auth-form" onSubmit={submit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

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

        <button disabled={isAuthLoading}>
          {isAuthLoading ? "Loading..." : "Sign Up"}
        </button>

        <div className="auth-alt">
          <a href="/login">Already have an account?</a>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;