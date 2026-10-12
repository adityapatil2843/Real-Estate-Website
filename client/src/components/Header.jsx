import React from "react";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="w-full z-50 bg-black/80 border-b border-white/10 sticky top-0">
      <Navbar />
    </header>
  );
};

export default Header;