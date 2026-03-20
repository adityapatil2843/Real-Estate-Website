import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  // ✅ Direct backend URL (no env)
  const backendUri = "http://localhost:5000";

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
        setUserData(data.userData);
      } else {
        toast.error("error 1: in context related to token");
      }
    } catch (error) {
        toast.error("error 2");
    }
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
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};