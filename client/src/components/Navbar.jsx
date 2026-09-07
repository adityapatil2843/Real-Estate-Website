import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContent } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import ProfileMenu from "./ProfileMenu";

axios.defaults.withCredentials = true;

const navLinks = [
  { name: "Home", href: "#Header" },
  { name: "About", href: "#About" },
  { name: "Projects", href: "#Projects" },
  { name: "Testimonials", href: "#Testimonials" },
  { name: "Contact", href: "#Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    userData,
    backendUri,
    setUserData,
    isLoggedIn,
    setIsLoggedIn,
  } = useContext(AppContent);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // ✅ Send verification OTP
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUri + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUri + "/api/auth/logout");

      if (data.success) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/">
          <img
            src={assets.logo}
            alt="Logo"
            className="w-24 sm:w-28 md:w-32 cursor-pointer"
          />
        </Link>

        {/* Desktop menu & Auth Buttons Grouped */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-8 text-white font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="hover:text-gray-300 transition">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Moved Post Property inside this flex group to keep layout aligned 
          <button
            onClick={() => navigate("/post")}
            className="bg-black text-white px-4 py-2 rounded-full hover:scale-105 transition"
          >
            Post Property
          </button>
            */}
          {/* 🔥 AUTH SECTION */}
          {isLoggedIn && userData ? (
            <ProfileMenu 
              userData={userData}
              onVerify={sendVerificationOtp}
              onLogout={logout}
            />
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 rounded-full bg-white text-black font-medium hover:opacity-90 transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button (Kept outside so it stays at the far right) */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden"
          aria-label="Open menu"
        >
          <img src={assets.menu_icon} className="w-7" alt="menu" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[82%] max-w-sm bg-white shadow-2xl transition-transform duration-300 z-40 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          {isLoggedIn && userData ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white font-semibold">
                {userData.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 leading-none">{userData.name}</span>
                <span className="text-xs text-gray-500 capitalize">{userData.role}</span>
              </div>
            </div>
          ) : (
            <div className="font-bold text-lg text-black">Menu</div>
          )}
          <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <img src={assets.cross_icon} className="w-5" alt="close" />
          </button>
        </div>

        <div className="px-5">
          <ul className="flex flex-col gap-3 text-gray-800 font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                >
                  {link.name}
                </a>
              </li>
            ))}
            {/* Added Post Property in Mobile Menu */}
            <li>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/post");
                }}
                className="w-full text-left px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-semibold"
              >
                Post Property
              </button>
            </li>
          </ul>

          {/* 🔥 MOBILE AUTH */}
          <div className="mt-6 flex flex-col gap-3">
            {isLoggedIn && userData ? (
              <>
                {!userData.isAccountVerified && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      sendVerificationOtp();
                    }}
                    className="w-full px-5 py-3 rounded-full border"
                  >
                    Verify Email
                  </button>
                )}

                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full px-5 py-3 rounded-full bg-black text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="w-full px-5 py-3 rounded-full border border-black"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/signup");
                  }}
                  className="w-full px-5 py-3 rounded-full bg-black text-white"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}
    </nav>
  );
};

export default Navbar;