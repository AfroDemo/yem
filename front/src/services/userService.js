import api, { put } from "../utils/api";
import { logout } from "./authService";

// Cache for storing user data
const userCache = new Map();

export const toggleUserVerification = async (userId) => {
  try {
    const response = await put(`/users/${userId}/verification`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to toggle user verification: " + error.message);
  }
};

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
    // Validate file before upload
    if (!imageFile) {
      throw new Error("No image file provided");
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error("Invalid file type. Please upload JPEG, PNG, or GIF");
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      throw new Error("File size exceeds 5MB limit");
    }

    const formData = new FormData();
    formData.append("profileImage", imageFile);

    // Add upload progress tracking
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
        // You could dispatch this to a progress state if needed
      },
    };

    const response = await api.put(`/users/${userId}/upload`, formData, config);

    if (!response.data?.profileImage) {
      throw new Error("Server response missing profile image URL");
    }

    // Update cache if exists
    if (userCache.has(userId)) {
      const user = userCache.get(userId);
      userCache.set(userId, {
        ...user,
        profileImage: response.data.profileImage,
      });
    }

    // Update localStorage if it's the current user
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          profileImage: response.data.profileImage,
        })
      );
    }

    return {
      success: true,
      profileImage: response.data.profileImage,
      message: "Profile image updated successfully",
    };
  } catch (error) {
    console.error("Profile image upload error:", error);

    // Clean up cache on error
    if (userCache.has(userId)) {
      userCache.delete(userId);
    }

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to upload profile image"
    );
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
