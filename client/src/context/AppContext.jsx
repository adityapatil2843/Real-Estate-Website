import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  // Read backend URL from environment or fallback to localhost
  const backendUri = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  axios.defaults.withCredentials = true;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Check auth status
  const getAuthStatus = async () => {
    try {
      const { data } = await axios.get(
        backendUri + "/api/auth/is-auth",
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("error 3");
      setIsLoggedIn(false);
    }
  };

  // ✅ Get user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(
  backendUri + "/api/auth/data",
  {
    withCredentials: true,
  }
);

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error("error 1: in context related to token");
      }
    } catch (error) {
        toast.error("error 2: data nahi mil raha context mein");
    }
  };

  const [adminMetrics, setAdminMetrics] = useState(null);
  const [adminOwners, setAdminOwners] = useState([]);
  const [adminListings, setAdminListings] = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);
  const [adminTourists, setAdminTourists] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);

  // ✅ Get Admin Data
  const getAdminMetrics = async () => {
    try {
      const { data } = await axios.get(backendUri + "/api/admin/metrics");
      if (data.success) setAdminMetrics(data.data);
    } catch (err) { console.error("Metrics DB Error"); }
  };

  const getAdminOwners = async () => {
    try {
      const { data } = await axios.get(backendUri + "/api/admin/owners");
      if (data.success) setAdminOwners(data.data);
    } catch (err) { console.error("Owners DB Error"); }
  };

  const getAdminListings = async () => {
    try {
      const { data } = await axios.get(backendUri + "/api/admin/listings");
      if (data.success) setAdminListings(data.data);
    } catch (err) { console.error("Listings DB Error"); }
  };

  const getAdminListingDetails = async (id) => {
    try {
      const { data } = await axios.get(`${backendUri}/api/admin/listings/${id}`);
      if (data.success) return data.data;
      return null;
    } catch (err) { 
      console.error("Listing Details Error");
      toast.error("Failed to load property details");
      return null;
    }
  };

  const getAdminBookings = async () => {
    try {
      const { data } = await axios.get(backendUri + "/api/admin/bookings");
      if (data.success) setAdminBookings(data.data);
    } catch (err) { console.error("Bookings DB Error"); }
  };

  const getAdminTourists = async () => {
    try {
      const { data } = await axios.get(backendUri + "/api/admin/tourists");
      if (data.success) setAdminTourists(data.data);
    } catch (err) { console.error("Tourists DB Error"); }
  };

  const getAdminReviews = async () => {
    try {
      const { data } = await axios.get(backendUri + "/api/admin/reviews");
      if (data.success) setAdminReviews(data.data);
    } catch (err) { console.error("Reviews DB Error"); }
  };

  // ✅ Admin Actions (Status Updates & Payouts)
  const updateAdminOwnerStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`${backendUri}/api/admin/owners/${id}/status`, { status });
      if (data.success) {
        toast.success(`Owner status updated: ${status}`);
        getAdminOwners();
      }
    } catch (error) { toast.error(error.response?.data?.message || "Error updating owner status"); }
  };

  const updateAdminListingStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`${backendUri}/api/admin/listings/${id}/status`, { status });
      if (data.success) {
        toast.success(`Listing status marked as: ${status}`);
        getAdminListings();
        getAdminMetrics(); // Refresh metrics too
      }
    } catch (error) { toast.error(error.response?.data?.message || "Error updating listing status"); }
  };

  const processAdminPayout = async (id) => {
    try {
      const { data } = await axios.patch(`${backendUri}/api/admin/bookings/${id}/payout`);
      if (data.success) {
        toast.success("Payout released successfully!");
        getAdminBookings();
      }
    } catch (error) { toast.error(error.response?.data?.message || "Error processing payout"); }
  };

  const updateAdminTouristStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`${backendUri}/api/admin/tourists/${id}/status`, { status });
      if (data.success) {
        toast.success(`Tourist status updated: ${status}`);
        getAdminTourists();
      }
    } catch (error) { toast.error(error.response?.data?.message || "Error updating tourist status"); }
  };

  const moderateAdminReview = async (id, status) => {
    try {
      const { data } = await axios.patch(`${backendUri}/api/admin/reviews/${id}/status`, { status });
      if (data.success) {
        toast.success(`Review moderation: ${status}`);
        getAdminReviews();
      }
    } catch (error) { toast.error(error.response?.data?.message || "Error moderating review"); }
  };

  useEffect(() => {
    getAuthStatus();
  }, []);

  const value = {
    backendUri,
    isLoggedIn,
    setIsLoggedIn, // IMPORTANT FIX
    userData,
    setUserData,
    getUserData,
    adminMetrics, getAdminMetrics,
    adminOwners, getAdminOwners,
    adminListings, getAdminListings,
    getAdminListingDetails,
    adminBookings, getAdminBookings,
    adminTourists, getAdminTourists,
    adminReviews, getAdminReviews,
    updateAdminOwnerStatus,
    updateAdminListingStatus,
    processAdminPayout,
    updateAdminTouristStatus,
    moderateAdminReview,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};