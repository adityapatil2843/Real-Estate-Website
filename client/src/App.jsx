import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Testimonial from "./components/Testimonial.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

import Signup from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";

const Home = () => {
  return (
    <>
      <Header />
      <About />
      <Projects />
      <Testimonial />
      <Contact />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <ToastContainer position="top-right" autoClose={2500} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;