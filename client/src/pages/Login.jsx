import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUri, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUri + "/api/auth/login",
        { email, password }
      );

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 relative">
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 w-28 cursor-pointer"
        alt="logo"
      />

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
        <p className="text-gray-500 text-center mb-6">
          Welcome back 👋
        </p>

        <form onSubmit={onSubmitHandler} className="space-y-4">

          <div className="flex items-center border rounded-lg px-3 py-2">
            <img src={assets.mail_icon} className="w-5 mr-2" alt="" />
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <img src={assets.lock_icon} className="w-5 mr-2" alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full outline-none"
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="text-sm text-right text-blue-500 cursor-pointer"
          >
            Forgot password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-black text-white hover:scale-105 transition">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="underline cursor-pointer font-medium"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;