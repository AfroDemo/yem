import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add auth token to headers
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle:
 * - Successful responses
 * - 401 Unauthorized errors (token expired/invalid)
 * - Other errors
 */
api.interceptors.response.use(
  (response) => {
    // Directly return successful responses
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Clear auth data and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden access
          console.error("Forbidden access:", error.response.data);
          break;
        case 404:
          // Handle not found errors
          console.error("Resource not found:", error.config.url);
          break;
        case 500:
          // Handle server errors
          console.error("Server error:", error.response.data);
          break;
        default:
          console.error("Request error:", error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const get = (url, config = {}) => api.get(url, config);
export const post = (url, data, config = {}) => api.post(url, data, config);
export const put = (url, data, config = {}) => api.put(url, data, config);
export const del = (url, config = {}) => api.delete(url, config);

export default api;
