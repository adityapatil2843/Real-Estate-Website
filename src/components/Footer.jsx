import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-300 mt-16" id="Footer">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="">
            <img
              className="w-40 mb-4"
              src={assets.logo_dark}
              alt="logo"
            />
            <p className="text-sm leading-relaxed text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed iure
              deserunt ipsa assumenda nesciunt sequi nemo officia quos ratione
              doloribus inventore minus, praesentium, quas facilis? Voluptatum
              ratione tenetur accusamus commodi?
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <a href="Header" className="hover:text-white transition">
                Home
              </a>
              <a href="Header" className="hover:text-white transition">
                About us
              </a>
              <a href="Header" className="hover:text-white transition">
                Contact us
              </a>
              <a href="Header" className="hover:text-white transition">
                Privacy Policy
              </a>
            </ul>
          </div>

          <div className="">
            <h3 className="text-lg font-semibold text-white mb-3">
              subscibe to news letter
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              the latest news, artivle & resources
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="email"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white/70 text-sm"
                r
              />
              <button className="px-5 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-800 text-center text-sm text-gray-500 py-4 px-4">
        copyrignt 2026 @xyz all right are fake
      </div>
    </div>
  )
}

export default Footer
