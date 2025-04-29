import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle Manual Login (without Firebase authentication)
  const handleManualLogin = (e) => {
    e.preventDefault();
    setError("");
    if (email && password) {
      alert(`Welcome, ${email}`);
      navigate("/avatar"); // ✅ Redirecting to avatar page
    } else {
      setError("Please enter both email and password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-96 border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back!</h2>
        <p className="text-white text-center mb-6 opacity-80">Login to your account</p>

        {error && <p className="text-red-400 text-center mb-4 font-medium">{error}</p>}

        {/* Manual Login Form */}
        <form onSubmit={handleManualLogin} className="space-y-4 mb-4">
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg font-semibold"
          >
            Login with Email
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-white/30" />
          <span className="mx-2 text-white opacity-70 text-sm">or</span>
          <hr className="flex-grow border-white/30" />
        </div>

        {/* Google Login (optional: can remove if not needed) */}
        {/* <button
          className="w-full bg-white text-black py-2 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg font-semibold mb-2"
        >
          Sign in with Google
        </button> */}

        <p className="text-center text-white text-sm mt-6 opacity-80">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-300 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-white text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-white bg-opacity-20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70"
    />
  </div>
);

export default Login;
