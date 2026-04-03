import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import hero1 from "../assets/hero-1.jpg";
import PropertySection from "./PropertySection.jsx";
import SearchBar from "./SearchBar.jsx";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="relative min-h-screen flex flex-col justify-between text-white overflow-hidden">

      {/* Background Image */}
      <img
        src={hero1}
        alt="header"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 -z-10" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-24">

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl">
          Find Your <span className="text-indigo-400">Dream Home</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
          Discover the best properties in your city with modern amenities and great pricing.
        </p>

        {/* Search + Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12">

          {/* Search */}
          <div className="w-full sm:w-auto">
            <SearchBar />
          </div>
          {/*
          
          <button
            onClick={() => navigate("/property")}
            className="px-7 py-3 rounded-full border border-white/70 backdrop-blur-md bg-white/10 hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:scale-105"
          >
            Available Properties
          </button>

          
          <a
            href="#Contact"
            className="px-7 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 shadow-lg hover:scale-105"
          >
            Contact Us
          </a>*/}

        </div>
      </div>

      {/* Bottom Property Section */}
      <div className="relative z-10 mt-20">
        <PropertySection />
      </div>

    </header>
  );
};

export default Header;