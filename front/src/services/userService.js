import api from "../utils/api";
import { logout } from "./authService";

// Cache for storing user data
const userCache = new Map();

// Get user by ID with caching
export const getUserById = async (userId, forceRefresh = false) => {
  try {
    // Return cached data if available and not forcing refresh
    if (userCache.has(userId) && !forceRefresh) {
      return userCache.get(userId);
    }

    const response = await api.get(`/users/${userId}`);
    const userData = response.data;

    // Cache the user data
    userCache.set(userId, userData);

    return userData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to get user data";
    console.error(`Error getting user ${userId}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Update user with optimistic updates
export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await api.put(`/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update local user data if updating current user
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          ...response.data,
        })
      );
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Trigger logout if unauthorized
      logout();
      window.location.href = "/login"; // Redirect to login
    }
    throw error.response?.data?.message || "Failed to update user";
  }
};

// Upload profile image with progress tracking
export const uploadProfileImage = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", imageFile);

    const response = await api.put(`/users/${userId}/profile-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });

    // Update cache if exists
    if (userCache.has(userId)) {
      const user = userCache.get(userId);
      userCache.set(userId, {
        ...user,
        profileImage: response.data.profileImage,
      });
    }

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to upload profile image";
    console.error(`Error uploading image for user ${userId}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Get all users with pagination support
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get("/users", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to get users";
    console.error("Error getting users:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Delete user with cleanup
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);

    // Remove from cache if exists
    if (userCache.has(userId)) {
      userCache.delete(userId);
    }

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete user";
    console.error(`Error deleting user ${userId}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Clear user cache
export const clearUserCache = () => {
  userCache.clear();
};
