import React from 'react'
import Header from './components/Header.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Testimonial from './components/Testimonial.jsx'
import Contact from './components/Contact.jsx'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer.jsx'

const App = () => {
  return (
    <div className='w-full overflow-hidden'>
      <ToastContainer/>
      <Header/>
      <About/>
      <Projects/>
      <Testimonial/>
      <Contact/>
      <Footer/>
    </div>
  )
}

export default App
