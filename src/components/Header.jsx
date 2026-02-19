import React from 'react'
import Navbar from './Navbar'

const Header = () => {
  return (
    <div
      className="min-h-screen mb-4 bg-cover bg-center flex flex-col items-center w-full overflow-hidden"
      style={{
        backgroundImage: `url('./src/assets/header_img.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />

      <div className="container text-center mx-auto py-4 px-4 md:px-20 lg:px-32 text-white">
        <h2 className="text-5xl sm:text-6xl md:text-[82px] font-semibold pt-20 leading-tight drop-shadow-lg">
          Explore homes that fit your dreams
        </h2>

        <div className="space-x-6 mt-16">
          <a
            href="#Projects"
            className="border border-white rounded px-8 py-3 hover:bg-white hover:text-black transition-all duration-300"
          >
            Projects
          </a>

          <a
            href="#Contact"
            className="border px-8 py-3 rounded border-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

export default Header
