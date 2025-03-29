import api from '../utils/api';

// Get user by ID
export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get user data';
  }
};

// Update user
export const updateUser = async (userId: string, userData: {
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  location?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update user data';
  }
};

// Upload profile image
export const uploadProfileImage = async (userId: string, imageUrl: string) => {
  try {
    const response = await api.put(`/users/${userId}/profile-image`, { imageUrl });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to upload profile image';
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get users';
  }
};

// Delete user (admin only)
export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete user';
  }
};
