import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext.jsx";

const Post = () => {
  const navigate = useNavigate();
  const { backendUri } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { data } = await axios.post(
      backendUri + "/api/owner/property",
      formData,
      {
        withCredentials: true,
      }
    );

    if (data) {
      toast.success("Property Posted Successfully");
      navigate("/property");
    }
  } catch (error) {
    toast.error("Post ka error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Post Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="text"
            name="title"
            placeholder="Title (e.g. 1BHK)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg outline-none"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg outline-none"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg outline-none"
          />

          <input
            type="text"
            name="location"
            placeholder="Location (e.g. Pune)"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg outline-none"
          />

          <button className="w-full py-2.5 rounded-full bg-black text-white hover:scale-105 transition">
            Post Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;