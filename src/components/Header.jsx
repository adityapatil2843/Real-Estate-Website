import React from 'react'
import Navbar from './Navbar'

const Header = () => {
  return (
    <div
      className="min-h-screen mb-4 bg-cover bg-center flex flex-col items-center w-full overflow-hidden relative"
      style={{
        backgroundImage: `url('./src/assets/header_img.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* subtle dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      <Navbar />

      <div className="container relative z-10 text-center mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-white">
        
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[82px] font-semibold pt-16 md:pt-20 leading-tight drop-shadow-xl max-w-5xl mx-auto">
          Explore homes that fit your dreams
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10 md:mt-14">
          
          <a
            href="#Projects"
            className="px-8 py-3 rounded-lg border border-white backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 font-medium shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Projects
          </a>

          <a
            href="#Contact"
            className="px-8 py-3 rounded-lg border border-blue-500 bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Contact Us
          </a>

        </div>
      </div>
    </div>
  )
}

export default Header
