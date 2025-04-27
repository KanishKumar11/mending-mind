"use client";

import { useState, useEffect, createContext, useContext } from "react";

// Simple PIN for dashboard access
const DASHBOARD_PIN = "908047"; // You can change this to any PIN you prefer

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("dashboard_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (pin) => {
    if (pin === DASHBOARD_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("dashboard_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("dashboard_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
