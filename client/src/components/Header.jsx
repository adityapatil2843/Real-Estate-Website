import React from "react";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="relative w-full z-50 bg-black/10 backdrop-blur-sm border-b border-white/5">
      <Navbar />
    </header>
  );
};

export default Header;