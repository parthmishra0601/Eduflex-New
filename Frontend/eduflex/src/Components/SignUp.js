import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-96 border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-white bg-opacity-20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-white bg-opacity-20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-white bg-opacity-20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-white text-sm mt-4 opacity-80">
          Already have an account?{" "}
          <Link to="/" className="text-blue-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
