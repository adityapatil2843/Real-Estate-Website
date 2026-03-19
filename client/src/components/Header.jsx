import React from "react";
import Navbar from "./Navbar";
import headerImg from "../assets/header_img.png";

const Header = () => {
  return (
    <header
      id="Header"
      className="relative min-h-screen flex flex-col justify-center text-white overflow-hidden"
    >
      <img
        src={headerImg}
        alt="header"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="absolute inset-0 bg-black/40 -z-10" />

      <Navbar />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[80px] font-semibold leading-tight drop-shadow-xl">
          Explore homes that fit your dreams
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-10">
          <a
            href="#Projects"
            className="px-6 py-3 rounded-full border border-white text-white hover:bg-white hover:text-black transition"
          >
            Projects
          </a>

          <a
            href="#Contact"
            className="px-6 py-3 rounded-full bg-white text-black hover:opacity-90 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;