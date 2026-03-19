import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backendUri = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUri}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Login successful 🚀");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 sm:top-6 sm:left-6"
      >
        <img src={assets.logo} className="w-24 sm:w-28 cursor-pointer" alt="logo" />
      </button>

      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <p className="text-gray-500 text-center mt-1 mb-6">
          Welcome back 👋
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-xl px-3 py-3">
            <img src={assets.mail_icon} alt="" className="w-5 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center border rounded-xl px-3 py-3">
            <img src={assets.lock_icon} alt="" className="w-5 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-sm text-blue-500"
            >
              Forgot password?
            </button>
          </div>

          <button className="w-full py-3 rounded-full bg-black text-white hover:opacity-90 transition">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-medium underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;