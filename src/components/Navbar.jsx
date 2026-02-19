import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'

const Navbar = () => {

  const [showMobileMenu, setShowMobileMenu] =useState(false)
  
  useEffect(()=>{
    if(showMobileMenu){
      document.body.style.overflow = 'hidden'
    }
    else{
      document.body.style.overflow = 'auto'
    }
    return ()=>{
      document.body.style.overflow = 'auto'
    }
  },[showMobileMenu])
  
  return (
    <div className='absolute top-0 left-0 w-full z-10'>
      <div className='flex items-center justify-between container mx-auto py-4 px-6 md:px-20 lg:px-32 bg-transparent'>
        <img src={assets.logo} alt="Logo" className='w-24 md:w-32' />
        <ul className='hidden md:flex gap-7 text-white'>
          <a href="#Header" className='hover:text-gray-400'>Home</a>
          <a href="#About" className='hover:text-gray-400'>About</a>
          <a href="#Project" className='hover:text-gray-400'>Projects</a>
          <a href="#Testimonials" className='hover:text-gray-400'>Testimonials</a>
        </ul>

        <button className='hidden md:block bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition'>
          Sign Up
        </button>
        <img onClick={()=>setShowMobileMenu(true)} src={assets.menu_icon} className='md:hidden w-7' alt="" />
      </div>
      {/*-------------------------mobile-meanu--------*/}
      <div className={`md:hidden ${showMobileMenu ? 'fixed w-full' : 'h-0 w-0'} bg-white transition-all right-0 top-0 bottom-0 overflow-hidden `}>
        <div className='flex justify-end p-6 cursor-pointer'>
          <img onClick={()=>setShowMobileMenu(false)} src={assets.cross_icon} className='w-6' alt="" />
        </div>
        <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
          <a onClick={()=>setShowMobileMenu(false)} href="#Home" className='border px-4 py-2 rounded-full inline-block'>Home</a>
          <a onClick={()=>setShowMobileMenu(false)} href="#About" className='border px-4 py-2 rounded-full inline-block'>About</a>
          <a onClick={()=>setShowMobileMenu(false)} href="#Projects" className='border px-4 py-2 rounded-full inline-block'>Projects</a>
          <a onClick={()=>setShowMobileMenu(false)} href="#Testimonials" className='border px-4 py-2 rounded-full inline-block'>Testimonials</a>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
