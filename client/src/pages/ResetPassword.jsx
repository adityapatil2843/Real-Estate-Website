import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUri } = useContext(AppContent);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        backendUri + "/api/auth/send-reset-otp",
        { email }
      );

      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleResetSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        backendUri + "/api/auth/reset-password",
        { email, otp, newPassword }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
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
        className="absolute top-6 left-6 w-28 sm:w-32 cursor-pointer"
        alt="logo"
      />

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-gray-500 text-center mb-6">
          {step === 1
            ? "Enter your email to receive OTP"
            : "Enter OTP and new password"}
        </p>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="flex items-center border rounded-lg px-3 py-2">
              <img src={assets.mail_icon} alt="" className="w-5 mr-2" />
              <input
                type="email"
                required
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <button className="w-full py-2.5 rounded-full bg-black text-white hover:scale-105 transition">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="border rounded-lg px-3 py-2">
              <input
                type="text"
                required
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border rounded-lg px-3 py-2">
              <img src={assets.lock_icon} alt="" className="w-5 mr-2" />
              <input
                type="password"
                required
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <button className="w-full py-2.5 rounded-full bg-black text-white hover:scale-105 transition">
              Reset Password
            </button>
          </form>
        )}

        <p
          onClick={() => navigate("/login")}
          className="text-center text-sm mt-4 underline cursor-pointer"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
