import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext.jsx";

const Post = () => {
  const navigate = useNavigate();
  const { backendUri } = useContext(AppContent);

  // ✅ Loading state
  const [loading, setLoading] = useState(false);

  // ✅ Form state (Added cleaningFee here)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Villa",
    city: "",
    address: "",
    perNight: "",
    cleaningFee: "", // Added
    adults: 1,
    children: 0,
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Validation
    if (!formData.title || !formData.description) {
      toast.error("All fields are required");
      return;
    }

    if (!formData.city || !formData.address) {
      toast.error("Location details are required");
      return;
    }

    if (formData.perNight <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      // ✅ Payload structure correctly pulling from formData
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        location: {
          city: formData.city,
          address: formData.address,
        },
        price: {
          perNight: Number(formData.perNight),
          cleaningFee: Number(formData.cleaningFee) || 0, // Added
        },
        capacity: {
          adults: Number(formData.adults),
          children: Number(formData.children),
          total: Number(formData.adults) + Number(formData.children),
        },
      };

      const { data } = await axios.post(
        `${backendUri}/api/owner/property`,
        payload,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Property Posted Successfully");

        // ✅ Reset form fully
        setFormData({
          title: "",
          description: "",
          type: "Villa",
          city: "",
          address: "",
          perNight: "",
          cleaningFee: "",
          adults: 1,
          children: 0,
        });

        // ✅ Navigate
        navigate("/property");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Post Your Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Luxurious 4BHK Villa"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Tell guests about your property..."
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Property Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5"
            >
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Farmhouse">Farmhouse</option>
              <option value="Resort">Resort</option>
            </select>
          </div>

          {/* City + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Lonavala"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Price Per Night</label>
              <input
                type="number"
                name="perNight"
                value={formData.perNight}
                onChange={handleChange}
                placeholder="e.g. 15000"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1"
              />
            </div>
          </div>

          {/* Cleaning Fee and Total Calculation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Cleaning Fee</label>
              <input
                type="number"
                name="cleaningFee"
                value={formData.cleaningFee}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1"
              />
            </div>

            <div className="flex flex-col justify-end pb-2">
              <p className="text-sm font-semibold text-gray-700">
                Total: ₹
                {(Number(formData.perNight) || 0) +
                  (Number(formData.cleaningFee) || 0)}
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Capacity</label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <input
                type="number"
                name="adults"
                min="1"
                placeholder="Adults"
                value={formData.adults}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2.5"
              />
              <input
                type="number"
                name="children"
                min="0"
                placeholder="Children"
                value={formData.children}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2.5"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;