import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../context/AppContext.jsx";

const AddProperty = () => {
  const { backendUri } = useContext(AppContent);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "villa",
    area: "Near Bhushi Dam",
    address: "",
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    priceWeekday: "",
    priceWeekend: "",
    pricePeak: "",
    securityDeposit: "",
    cleaningFee: "",
    checkIn: "13:00",
    checkOut: "11:00",
    smokingAllowed: false,
    petsAllowed: false,
    bachelorsAllowed: false,
    description: "",
    image1: "", image2: "", image3: "", image4: "", videoURL: "",
  });

  const [files, setFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    video: null
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files: targetFiles } = e.target;
    if (type === "file") {
      setFiles(prev => ({ ...prev, [name]: targetFiles[0] }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      
      // Map form fields to backend Schema structure
      const propertyDataObject = {
        title: formData.title,
        description: formData.description,
        type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
        location: {
          city: "Lonavala",
          area: formData.area,
          address: formData.address,
        },
        capacity: {
          adults: Number(formData.maxGuests),
          total: Number(formData.maxGuests),
        },
        price: {
          perNight: Number(formData.priceWeekday),
          cleaningFee: Number(formData.cleaningFee) || 0,
        },
        amenities: [
          ...(formData.smokingAllowed ? ["Smoking Allowed"] : []),
          ...(formData.petsAllowed ? ["Pets Allowed"] : []),
          ...(formData.bachelorsAllowed ? ["Bachelors Allowed"] : []),
        ]
      };

      // Append JSON data
      formPayload.append("propertyData", JSON.stringify(propertyDataObject));

      // Media Files
      if (files.image1) formPayload.append("images", files.image1);
      if (files.image2) formPayload.append("images", files.image2);
      if (files.image3) formPayload.append("images", files.image3);
      if (files.image4) formPayload.append("images", files.image4);
      if (files.video) formPayload.append("video", files.video);

      const { data } = await axios.post(
        `${backendUri}/api/owner/properties`,
        formPayload,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (data.success) {
        toast.success("Property submitted for admin approval!");
        setMessage("Property submitted for admin approval!");

        // Reset form
        setFormData({
          title: "", type: "villa", area: "Near Bhushi Dam", address: "",
          maxGuests: 1, bedrooms: 1, bathrooms: 1, priceWeekday: "",
          priceWeekend: "", pricePeak: "", securityDeposit: "", cleaningFee: "",
          checkIn: "13:00", checkOut: "11:00", smokingAllowed: false,
          petsAllowed: false, bachelorsAllowed: false, description: "",
          image1: "", image2: "", image3: "", image4: "", videoURL: "",
        });
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to add property.";
      toast.error(errorMsg);
      setMessage("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl max-w-full">
      <Link to="/owner/properties" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
        &larr; Back to Properties
      </Link>

      {message && (
        <div className={`p-4 rounded-md mb-6 font-medium ${message.includes("Error") ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Info</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="cottage">Cottage</option>
                <option value="bungalow">Bungalow</option>
                <option value="farmhouse">Farmhouse</option>
                <option value="room">Room</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <select name="area" value={formData.area} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                <option value="Near Bhushi Dam">Near Bhushi Dam</option>
                <option value="Khandala side">Khandala side</option>
                <option value="Old Lonavala">Old Lonavala</option>
                <option value="Fariyas road">Fariyas road</option>
                <option value="Tiger's Leap">Tiger's Leap</option>
                <option value="Tungarli">Tungarli</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
              <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleChange} min="1" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Pricing Structure (₹)</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weekday Price/Night</label>
              <input type="number" name="priceWeekday" value={formData.priceWeekday} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weekend Price/Night</label>
              <input type="number" name="priceWeekend" value={formData.priceWeekend} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peak Season/Night</label>
              <input type="number" name="pricePeak" value={formData.pricePeak} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
              <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Fee</label>
              <input type="number" name="cleaningFee" value={formData.cleaningFee} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">House Rules</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
              <input type="time" name="checkIn" value={formData.checkIn} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
              <input type="time" name="checkOut" value={formData.checkOut} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <label className="flex items-center space-x-3 text-sm font-medium text-gray-700">
              <input type="checkbox" name="smokingAllowed" checked={formData.smokingAllowed} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <span>Smoking Allowed</span>
            </label>
            <label className="flex items-center space-x-3 text-sm font-medium text-gray-700">
              <input type="checkbox" name="petsAllowed" checked={formData.petsAllowed} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <span>Pets Allowed</span>
            </label>
            <label className="flex items-center space-x-3 text-sm font-medium text-gray-700">
              <input type="checkbox" name="bachelorsAllowed" checked={formData.bachelorsAllowed} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <span>Bachelors Allowed</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Description</h3>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Detail your property's unique features..."></textarea>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Media Upload (Files)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo 1 (Primary)</label>
              <input type="file" name="image1" onChange={handleChange} accept="image/*" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo 2</label>
              <input type="file" name="image2" onChange={handleChange} accept="image/*" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo 3</label>
              <input type="file" name="image3" onChange={handleChange} accept="image/*" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo 4</label>
              <input type="file" name="image4" onChange={handleChange} accept="image/*" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
            <input type="file" name="video" onChange={handleChange} accept="video/*" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer" />
          </div>
          <p className="mt-2 text-xs text-gray-500 italic">* Properties with media have a 70% higher booking rate.</p>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm disabled:opacity-50">
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProperty;
