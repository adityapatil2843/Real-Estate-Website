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

import Login from "./pages/Login.jsx";
import Signup from "./pages/SignUp.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Post from "./pages/Post.jsx";
import PropertyList from "./pages/PropertyList.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";
import PropertySection from "./components/PropertySection.jsx";
import Hero from "./components/Hero.jsx";

// Admin Context & Components
import { MockAuthProvider } from "./context/MockAuthContext.jsx";
import { ProtectedRoute } from "./components/admin/AdminLayout.jsx";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard.jsx";
import Owners from "./pages/admin/Owners.jsx";
import Listings from "./pages/admin/Listings.jsx";
import Bookings from "./pages/admin/Bookings.jsx";
import Tourists from "./pages/admin/Tourists.jsx";
import Payments from "./pages/admin/Payments.jsx";
import Reviews from "./pages/admin/Reviews.jsx";

// Owner Components & Pages
import OwnerLayout from "./components/owner/OwnerLayout.jsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import OwnerProperties from "./pages/owner/OwnerProperties.jsx";
import AddProperty from "./pages/owner/AddProperty.jsx";
import OwnerBookings from "./pages/owner/OwnerBookings.jsx";
import OwnerReviews from "./pages/owner/OwnerReviews.jsx";
import OwnerEarnings from "./pages/owner/OwnerEarnings.jsx";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <PropertySection />
      <About />
      <Testimonial />
      <Contact />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <MockAuthProvider>
      <div className="w-full overflow-x-hidden">
        <ToastContainer position="top-right" autoClose={2500} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/property" element={<PropertyList />} />
          <Route path="/property/:id" element={<PropertyDetail />} />

          {/* Owner Panel Routes */}
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="properties" element={<OwnerProperties />} />
            <Route path="properties/add" element={<AddProperty />} />
            <Route path="bookings" element={<OwnerBookings />} />
            <Route path="reviews" element={<OwnerReviews />} />
            <Route path="earnings" element={<OwnerEarnings />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/owners"
            element={
              <ProtectedRoute>
                <Owners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <ProtectedRoute>
                <Listings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tourists"
            element={
              <ProtectedRoute>
                <Tourists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </MockAuthProvider>
  );
};

export default App;