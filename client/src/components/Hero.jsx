import React from "react";
import hero1 from "../assets/hero-1.jpg";
import SearchBar from "./SearchBar.jsx";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <img
        src={hero1}
        alt="header"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 -z-10" />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black leading-tight drop-shadow-2xl">
          Find Your <span className="text-indigo-400">Dream VILLA</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto font-medium">
          Discover handpicked verified properties with premium amenities in Lonavala.
        </p>

        {/* Search */}
        <div className="w-full mt-10">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default Hero;
