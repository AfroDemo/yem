import api from '../utils/api';

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get user data';
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    console.log(userData)
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update user data';
  }
};

// Upload profile image
export const uploadProfileImage = async (userId, imageUrl) => {
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
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete user';
  }
};