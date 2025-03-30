import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  isAuthenticated,
  logout,
} from "../services/authService";
import { post } from "../utils/api"; // import your post function from your API helper file

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  setError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Error loading user:", err);
          setError("Failed to load user data");
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setError(null); // Clear any previous errors when the user logs in
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setError(null); // Clear any errors on logout
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Login handler
  const loginHandler = async (data) => {
    try {
      const response = await post("/auth/login", data );
      const { token, user } = response.data;
      login(token, user);
      window.location.href = "/dashboard"; // Optionally redirect to the dashboard
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed, please try again.");
    }
  };

  // Register handler
  const registerHandler = async (data) => {
    try {
      const response = await post("/auth/register", data);
      const { token, user } = response.data;
      login(token, user);
      window.location.href = "/dashboard"; // Optionally redirect to the dashboard
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed, please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout: handleLogout,
        updateUser,
        setError,
        loginHandler,
        registerHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
