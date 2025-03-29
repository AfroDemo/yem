import api from '../utils/api';

// Create mentee profile
export const createMenteeProfile = async (profileData: {
  entrepreneurshipStage: string;
  businessIdea: string;
  goals: string[];
  challenges: string[];
  preferredMentorExpertise: string[];
  educationBackground?: string;
  workExperience?: string;
}) => {
  try {
    const response = await api.post('/mentee-profiles', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create mentee profile';
  }
};

// Get all mentee profiles
export const getAllMenteeProfiles = async () => {
  try {
    const response = await api.get('/mentee-profiles');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get mentee profiles';
  }
};

// Get mentee profile by ID
export const getMenteeProfileById = async (profileId: string) => {
  try {
    const response = await api.get(`/mentee-profiles/${profileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get mentee profile';
  }
};

// Update mentee profile
export const updateMenteeProfile = async (profileId: string, profileData: {
  entrepreneurshipStage?: string;
  businessIdea?: string;
  goals?: string[];
  challenges?: string[];
  preferredMentorExpertise?: string[];
  educationBackground?: string;
  workExperience?: string;
}) => {
  try {
    const response = await api.put(`/mentee-profiles/${profileId}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update mentee profile';
  }
};
