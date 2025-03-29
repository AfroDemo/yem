import api from '../utils/api';

// Create mentor profile
export const createMentorProfile = async (profileData: {
  expertise: string[];
  experience: string;
  company: string;
  position: string;
  availability: string;
  mentorshipStyle: string;
  maxMentees?: number;
}) => {
  try {
    const response = await api.post('/mentor-profiles', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create mentor profile';
  }
};

// Get all mentor profiles
export const getAllMentorProfiles = async () => {
  try {
    const response = await api.get('/mentor-profiles');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get mentor profiles';
  }
};

// Get mentor profile by ID
export const getMentorProfileById = async (profileId: string) => {
  try {
    const response = await api.get(`/mentor-profiles/${profileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get mentor profile';
  }
};

// Update mentor profile
export const updateMentorProfile = async (profileId: string, profileData: {
  expertise?: string[];
  experience?: string;
  company?: string;
  position?: string;
  availability?: string;
  mentorshipStyle?: string;
  maxMentees?: number;
  acceptingMentees?: boolean;
}) => {
  try {
    const response = await api.put(`/mentor-profiles/${profileId}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update mentor profile';
  }
};

// Get featured mentors
export const getFeaturedMentors = async () => {
  try {
    const response = await api.get('/mentor-profiles/featured');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get featured mentors';
  }
};

// Search mentors by expertise
export const searchMentorsByExpertise = async (expertise: string) => {
  try {
    const response = await api.get(`/mentor-profiles/search?expertise=${expertise}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to search mentors';
  }
};
