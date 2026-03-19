import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const backendUri = "http://localhost:5000";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUri}/api/auth/register`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Signup successful 🚀");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">
          Join us in a few clicks
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-xl outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-xl outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-xl outline-none"
          />

          <button className="w-full bg-black text-white py-3 rounded-full hover:opacity-90 transition">
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;