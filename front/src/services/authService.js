import api from "../utils/api";

const storage = {
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  get: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: (key) => localStorage.removeItem(key),
};

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

// Login user
export const login = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);

    // Save token and user data to localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// Logout user
export const logout = () => {
  storage.remove("token");
  storage.remove("user");
};

// Get current user
export const getCurrentUser = async () => {
  const cachedUser = storage.get("user");

  if (cachedUser) {
    // Return cached user immediately while fetching fresh data
    refreshUserData();
    return cachedUser;
  } else {
    return await refreshUserData();
  }
};

// Refresh user data from API
export const refreshUserData = async () => {
  try {
    const response = await api.get("/auth/me");
    storage.set("user", response.data);
    return response.data;
  } catch (error) {
    logout(); // Logout if session is invalid
    return null;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to process forgot password request"
    );
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to reset password";
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to verify email";
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Get user role
export const getUserRole = () => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user).role;
  }
  return null;
};

// Get user ID
export const getUserId = () => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user).id;
  }
  return null;
};
