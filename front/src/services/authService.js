import api from "../utils/api";
import { EventEmitter } from "events";

// Create an event emitter for auth state changes
const authEmitter = new EventEmitter();

const storage = {
  set: (key, value) => {
    // Only stringify if value is an object
    const toStore = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, toStore);
  },
  get: (key) => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    // Try to parse as JSON, if fails return raw string (for JWT tokens)
    try {
      return JSON.parse(item);
    } catch (e) {
      return item; // Return the raw string if not valid JSON
    }
  },
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};

// Token management
const token = {
  get: () => localStorage.getItem("token"), // Directly get the string
  set: (newToken) => localStorage.setItem("token", newToken), // Store as plain string
  remove: () => localStorage.removeItem("token"),
  exists: () => !!localStorage.getItem("token"),
};

// User data management (still needs JSON parsing)
const user = {
  get: () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },
  set: (userData) => localStorage.setItem("user", JSON.stringify(userData)),
  remove: () => localStorage.removeItem("user"),
};

// Register user with email verification support
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);

    // For immediate login after registration (if your API supports it)
    if (response.data.token) {
      token.set(response.data.token);
      user.set(response.data.user);
      authEmitter.emit("login", response.data.user);
    }

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    authEmitter.emit("error", { action: "register", error: message });
    throw message;
  }
};

// Login with token refresh support
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    token.set(response.data.token);
    user.set(response.data.user);

    // Schedule token refresh before expiration
    scheduleTokenRefresh();

    authEmitter.emit("login", response.data.user);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    authEmitter.emit("error", { action: "login", error: message });
    throw message;
  }
};

// Enhanced logout with event emission
export const logout = () => {
  authEmitter.emit("beforeLogout", user.get());
  storage.clear();
  authEmitter.emit("logout");
  cancelTokenRefresh();
};

// Current user with cache invalidation
export const getCurrentUser = async (forceRefresh = false) => {
  const cachedUser = user.get();

  if (!forceRefresh && cachedUser) {
    // Refresh in background without waiting
    refreshUserData().catch(console.error);
    return cachedUser;
  }

  return await refreshUserData();
};

// Token refresh scheduler
let refreshTimeout;
const scheduleTokenRefresh = () => {
  cancelTokenRefresh();

  // Refresh token 1 minute before expiration (adjust based on your token expiry)
  const jwt = parseJwt(token.get());
  if (jwt?.exp) {
    const expiresIn = jwt.exp * 1000 - Date.now() - 60000;
    if (expiresIn > 0) {
      refreshTimeout = setTimeout(() => {
        refreshToken().catch(console.error);
      }, expiresIn);
    }
  }
};

const cancelTokenRefresh = () => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }
};

// JWT parser helper
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Token refresh implementation
const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token", {
      token: token.get(),
    });

    token.set(response.data.token);
    scheduleTokenRefresh();
    return response.data;
  } catch (error) {
    // If refresh fails, logout the user
    logout();
    throw error.response?.data?.message || "Session expired";
  }
};

// Enhanced user data refresh
export const refreshUserData = async () => {
  try {
    const response = await api.get("/auth/me");
    user.set(response.data);
    authEmitter.emit("userUpdated", response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      logout();
    }
    throw error.response?.data?.message || "Failed to refresh user data";
  }
};

// Password reset flows
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Password reset failed";
    authEmitter.emit("error", { action: "forgotPassword", error: message });
    throw message;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Password reset failed";
    authEmitter.emit("error", { action: "resetPassword", error: message });
    throw message;
  }
};

// Email verification
export const verifyEmail = async (verificationToken) => {
  try {
    const response = await api.post("/auth/verify-email", {
      token: verificationToken,
    });

    // Update user verification status if logged in
    if (isAuthenticated()) {
      const currentUser = user.get();
      if (currentUser) {
        user.set({ ...currentUser, isVerified: true });
      }
    }

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Email verification failed";
    authEmitter.emit("error", { action: "verifyEmail", error: message });
    throw message;
  }
};

// Auth state utilities
export const isAuthenticated = () => token.exists();
export const getUserRole = () => user.get()?.role;
export const getUserId = () => user.get()?.id;
export const isAdmin = () => user.isAdmin();

// Event subscription
export const onAuthChange = (callback) => {
  authEmitter.on("login", (user) => callback({ isAuthenticated: true, user }));
  authEmitter.on("logout", () =>
    callback({ isAuthenticated: false, user: null })
  );
  authEmitter.on("userUpdated", (user) =>
    callback({ isAuthenticated: true, user })
  );

  // Return unsubscribe function
  return () => {
    authEmitter.off("login", callback);
    authEmitter.off("logout", callback);
    authEmitter.off("userUpdated", callback);
  };
};

// Initialize auth state
export const initAuth = async () => {
  if (isAuthenticated()) {
    try {
      await refreshUserData();
      scheduleTokenRefresh();
    } catch (error) {
      logout();
    }
  }
};

// Initialize on import
initAuth().catch(console.error);
