import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUri, getUserData } = useContext(AppContent);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  // STEP 1 → Send OTP
  const handleSendOtp = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.post(
        backendUri + "/api/auth/send-verify-otp",
        {},
        { withCredentials: true }
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

  // STEP 2 → Verify OTP
  const handleVerify = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.post(
        backendUri + "/api/auth/verify-account",
        { otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        await getUserData(); // refresh user
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
        className="absolute top-6 left-6 w-28 sm:w-32 cursor-pointer"
        alt="logo"
      />

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Email
        </h2>

        <p className="text-gray-500 text-center mb-6">
          {step === 1
            ? "Click below to receive verification OTP"
            : "Enter OTP to verify your account"}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <button className="w-full py-2.5 rounded-full bg-black text-white hover:scale-105 transition">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
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

            <button className="w-full py-2.5 rounded-full bg-black text-white hover:scale-105 transition">
              Verify Account
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

export default EmailVerify;