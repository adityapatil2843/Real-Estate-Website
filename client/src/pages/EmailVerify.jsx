import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const { backendUri, isLoggedin, userData, getUserData } =
    useContext(AppContent);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData]);

  const handleInput = (e, index) => {
    if (
      e.target.value.length > 0 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeydown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const otp = inputRefs.current
        .map((input) => input.value)
        .join("");

      const { data } = await axios.post(
        backendUri + "/api/auth/verify-account",
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <img
          src={assets.logo}
          className="w-28 sm:w-32 mx-auto mb-6"
          alt="logo"
        />

        <h1 className="text-2xl font-bold mb-2">
          Email Verification
        </h1>

        <p className="text-gray-500 mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        <form onSubmit={onSubmitHandler}>
          <div
            className="flex justify-between gap-2 mb-6"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  onKeyDown={(e) => handleKeydown(e, index)}
                  onInput={(e) => handleInput(e, index)}
                  className="w-12 h-12 text-center border rounded-lg text-lg outline-none focus:ring-2 focus:ring-black"
                />
              ))}
          </div>

          <button className="w-full py-2.5 rounded-full bg-black text-white hover:scale-105 transition">
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
