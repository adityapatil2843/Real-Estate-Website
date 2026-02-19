import React from 'react'
import { assets, testimonialsData } from '../assets/assets.js'

const Testimonial = () => {
  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      id="Testimonials"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
        Customer <span className="font-light text-gray-500">Testimonial</span>
      </h1>

      <p className="text-center text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
        Real stories from those who found home with us
      </p>

      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={index}
            className="w-full sm:w-[48%] lg:w-[30%] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center group"
          >
            <img
              className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-gray-100 group-hover:scale-105 transition-transform duration-300"
              src={testimonial.image}
              alt={testimonial.name}
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              {testimonial.name}
            </h2>

            <p className="text-sm text-gray-500">{testimonial.title}</p>

            <div className="flex justify-center gap-1 mt-3">
              {Array.from({ length: testimonial.rating }, (item, index) => (
                <img
                  className="w-4 h-4"
                  key={index}
                  src={assets.star_icon}
                  alt="star"
                />
              ))}
            </div>

            <p className="text-gray-600 text-sm mt-4 leading-relaxed">
              {testimonial.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial
