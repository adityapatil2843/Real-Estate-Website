import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div
      className='flex flex-col items-center justify-center 
      container mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden'
      id='About'
    >
      <h1 className='text-2xl sm:text-4xl font-bold mb-2'>
        About{' '}
        <span className='underline underline-offset-4 decoration-1 font-light'>
          Our Brand
        </span>
      </h1>

      <p className='text-gray-500 max-w-80 text-center mb-8'>
        Passionate about properties, dedicated to our vision
      </p>

      <div className='flex flex-col md:flex-row items-center md:items-start md:gap-20'>
        <img
          className='w-full sm:w-1/2 max-w-lg rounded-2xl shadow-lg'
          src={assets.brand_img}
          alt='Brand'
        />

        <div className='flex flex-col items-center md:items-start mt-10 text-gray-600'>
          <div className='grid grid-cols-2 gap-6 md:gap-10 w-full pr-0 md:pr-28'>
            <div>
              <p className='text-4xl font-medium text-gray-900'>10+</p>
              <p>Years of Excellence</p>
            </div>
            <div>
              <p className='text-4xl font-medium text-gray-900'>12+</p>
              <p>Projects Completed</p>
            </div>
            <div>
              <p className='text-4xl font-medium text-gray-900'>20+</p>
              <p>Mn. Sq. Ft. Delivered</p>
            </div>
            <div>
              <p className='text-4xl font-medium text-gray-900'>25+</p>
              <p>Ongoing Projects</p>
            </div>
          </div>

          <p className='my-10 max-w-lg'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis animi
            a ut dolorem, iusto nam quod eaque molestias soluta, commodi
            possimus at quos illum modi accusamus qui repellendus odio unde.
          </p>

          <button className='w-full md:w-1/3 bg-blue-600 text-white font-medium text-xl rounded-2xl p-2 hover:bg-blue-700 transition-all shadow-lg'>
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default About
