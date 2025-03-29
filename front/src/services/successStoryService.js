import api from '../utils/api';

// Create success story
export const createSuccessStory = async (storyData: {
  title: string;
  content: string;
  menteeId: string;
  mentorId: string;
  businessName: string;
  achievements?: string[];
  tags?: string[];
  testimonial?: string;
}) => {
  try {
    const response = await api.post('/success-stories', storyData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create success story';
  }
};

// Get all success stories
export const getAllSuccessStories = async () => {
  try {
    const response = await api.get('/success-stories');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get success stories';
  }
};

// Get success story by ID
export const getSuccessStoryById = async (storyId: string) => {
  try {
    const response = await api.get(`/success-stories/${storyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get success story';
  }
};

// Update success story
export const updateSuccessStory = async (storyId: string, storyData: {
  title?: string;
  content?: string;
  businessName?: string;
  achievements?: string[];
  tags?: string[];
  testimonial?: string;
}) => {
  try {
    const response = await api.put(`/success-stories/${storyId}`, storyData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update success story';
  }
};

// Delete success story
export const deleteSuccessStory = async (storyId: string) => {
  try {
    const response = await api.delete(`/success-stories/${storyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete success story';
  }
};

// Get featured success stories
export const getFeaturedSuccessStories = async () => {
  try {
    const response = await api.get('/success-stories/featured');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get featured success stories';
  }
};
