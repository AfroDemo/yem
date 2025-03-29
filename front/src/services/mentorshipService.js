import api from '../utils/api';

// Create mentorship request
export const createMentorship = async (mentorshipData: {
  mentorId: string;
  goals?: string[];
  meetingFrequency: string;
}) => {
  try {
    const response = await api.post('/mentorships', mentorshipData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create mentorship request';
  }
};

// Get mentorship by ID
export const getMentorshipById = async (mentorshipId: string) => {
  try {
    const response = await api.get(`/mentorships/${mentorshipId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get mentorship';
  }
};

// Update mentorship
export const updateMentorship = async (mentorshipId: string, mentorshipData: {
  goals?: string[];
  meetingFrequency?: string;
  nextMeetingDate?: Date;
}) => {
  try {
    const response = await api.put(`/mentorships/${mentorshipId}`, mentorshipData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update mentorship';
  }
};

// Update mentorship status
export const updateMentorshipStatus = async (mentorshipId: string, status: 'pending' | 'active' | 'completed' | 'rejected') => {
  try {
    const response = await api.put(`/mentorships/${mentorshipId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update mentorship status';
  }
};

// Get mentorships by mentor
export const getMentorshipsByMentor = async (mentorId: string) => {
  try {
    const response = await api.get(`/mentorships/mentor/${mentorId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get mentorships';
  }
};

// Get mentorships by mentee
export const getMentorshipsByMentee = async (menteeId: string) => {
  try {
    const response = await api.get(`/mentorships/mentee/${menteeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get mentorships';
  }
};

// Add progress update
export const addProgressUpdate = async (mentorshipId: string, progressData: {
  note: string;
  achievements?: string[];
}) => {
  try {
    const response = await api.post(`/mentorships/${mentorshipId}/progress`, progressData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add progress update';
  }
};

// Add feedback
export const addFeedback = async (mentorshipId: string, feedbackData: {
  mentorFeedback?: string;
  menteeFeedback?: string;
  mentorRating?: number;
  menteeRating?: number;
}) => {
  try {
    const response = await api.post(`/mentorships/${mentorshipId}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add feedback';
  }
};
