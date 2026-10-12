import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContent } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import ProfileMenu from "./ProfileMenu";

axios.defaults.withCredentials = true;

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
    <nav className="w-full relative z-30">
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
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 active:scale-95 transition cursor-pointer"
          aria-label="Open menu"
        >
          <img src={assets.menu_icon} className="w-7 h-auto pointer-events-none" alt="menu" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50 overflow-y-auto md:hidden ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        style={{ backgroundColor: "#ffffff" }}
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
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
            aria-label="Close menu"
          >
            <img src={assets.cross_icon} className="w-5 h-5 pointer-events-none" alt="close" />
          </button>
        </div>

        <div className="px-5 pb-8">
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
                type="button"
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
                    type="button"
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
                  type="button"
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
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="w-full px-5 py-3 rounded-full border border-black"
                >
                  Login
                </button>

                <button
                  type="button"
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
          className="fixed inset-0 bg-black/60 z-40 md:hidden cursor-pointer"
        />
      )}
    </nav>
  );
};

export default Navbar;