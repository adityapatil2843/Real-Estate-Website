import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'

const Navbar = () => {

  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showMobileMenu])

  return (
    <div className="absolute top-0 left-0 w-full z-20">
      
      {/* desktop navbar */}
      <div className="flex items-center justify-between container mx-auto py-4 px-4 sm:px-6 lg:px-8 bg-transparent">
        
        <img
          src={assets.logo}
          alt="Logo"
          className="w-24 md:w-32 cursor-pointer"
        />

        <ul className="hidden md:flex items-center gap-8 text-white font-medium">
          <a href="#Header" className="hover:text-gray-300 transition">Home</a>
          <a href="#About" className="hover:text-gray-300 transition">About</a>
          <a href="#Project" className="hover:text-gray-300 transition">Projects</a>
          <a href="#Testimonials" className="hover:text-gray-300 transition">Testimonials</a>
        </ul>

        <button className="hidden md:block bg-white text-black px-6 py-2.5 rounded-full font-medium shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 active:scale-[0.97]">
          Sign Up
        </button>

        <img
          onClick={() => setShowMobileMenu(true)}
          src={assets.menu_icon}
          className="md:hidden w-7 cursor-pointer"
          alt="menu"
        />
      </div>

      {/* ------------------------- mobile menu ------------------------ */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 bg-white w-72 max-w-[80%] transform transition-transform duration-300 ease-in-out shadow-2xl ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-6 cursor-pointer">
          <img
            onClick={() => setShowMobileMenu(false)}
            src={assets.cross_icon}
            className="w-6"
            alt="close"
          />
        </div>

        <ul className="flex flex-col items-center gap-4 mt-8 px-6 text-lg font-medium text-gray-800">
          <a
            onClick={() => setShowMobileMenu(false)}
            href="#Home"
            className="w-full text-center border border-gray-200 px-4 py-3 rounded-full hover:bg-gray-100 transition"
          >
            Home
          </a>

          <a
            onClick={() => setShowMobileMenu(false)}
            href="#About"
            className="w-full text-center border border-gray-200 px-4 py-3 rounded-full hover:bg-gray-100 transition"
          >
            About
          </a>

          <a
            onClick={() => setShowMobileMenu(false)}
            href="#Projects"
            className="w-full text-center border border-gray-200 px-4 py-3 rounded-full hover:bg-gray-100 transition"
          >
            Projects
          </a>

          <a
            onClick={() => setShowMobileMenu(false)}
            href="#Testimonials"
            className="w-full text-center border border-gray-200 px-4 py-3 rounded-full hover:bg-gray-100 transition"
          >
            Testimonials
          </a>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
