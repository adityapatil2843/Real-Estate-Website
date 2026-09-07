import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const MockAuthProvider = ({ children }) => {
  // Hardcoded to true as required by the instruction "isAdmin: true hardcoded so the panel is accessible"
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useMockAuth = () => useContext(AuthContext);
