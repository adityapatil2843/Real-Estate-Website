import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
 // 👈 Added missing toast import

// Better practice: Set this globally in App.jsx or main.js instead of here
axios.defaults.withCredentials = true;

const SearchBar = () => {
  const navigate = useNavigate();
  const { backendUri } = useContext(AppContent);

  // State
  const [location, setLocation] = useState("Lonavala");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Handle Search
  const handleSearch = async () => {
    try {
      // ✅ Basic Validation
      if (!location.trim()) {
        toast.error("Please enter a location");
        return;
      }

      if (!checkIn || !checkOut) {
        toast.error("Please select both check-in & check-out dates");
        return;
      }

      if (new Date(checkIn) >= new Date(checkOut)) {
        toast.error("Check-out must be after check-in");
        return;
      }

      // ✅ API Call with Query Params
      const { data } = await axios.get(
        `${backendUri}+/api/propertyList/search`,
        {
          params: {
            location: location.trim(),
            checkIn,
            checkOut,
            adults,
            children,
          },
        }
      );

      // ✅ Navigate to result page with state
      navigate("/property", {
        state: {
          results: data,
          searchData: { location, checkIn, checkOut, adults, children },
        },
      });

    } catch (error) {
      console.error(error);
      toast.error("Search failed, please try again");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-4 sm:p-6">

      {/* Search Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Location */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="border border-gray-300 rounded-lg px-4 py-2.5 mt-1 text-gray-800 placeholder-gray-400 bg-white shadow-sm transition-all duration-200 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5"
          />
        </div>

        {/* Check In */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Check In</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 mt-1 text-gray-800 placeholder-gray-400 bg-white shadow-sm transition-all duration-200 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5"
          />
        </div>

        {/* Check Out */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Check Out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 mt-1 text-gray-800 placeholder-gray-400 bg-white shadow-sm transition-all duration-200 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5"
          />
        </div>

        {/* Guests */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Guests</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              min="1"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))} // 👈 Cast to Number
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2.5 mt-1 text-gray-800 placeholder-gray-400 bg-white shadow-sm transition-all duration-200 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5"
              placeholder="Adults"
            />
            <input
              type="number"
              min="0"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))} // 👈 Cast to Number
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2.5 mt-1 text-gray-800 placeholder-gray-400 bg-white shadow-sm transition-all duration-200 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5"
              placeholder="Children"
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition"
          >
            Search
          </button>
        </div>

      </div>
    </div>
  );
};

export default SearchBar;