import { get } from "../utils/api";

// Fetch dashboard metrics (active mentees, upcoming sessions, hours mentored, average rating)
export const getMentorDashboardMetrics = async (mentorId) => {
  try {
    const response = await get(`/mentors/${mentorId}/dashboard-metrics`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch dashboard metrics: " + error.message);
  }
};

// Fetch today's sessions
export const getTodaysSessions = async (mentorId) => {
  try {
    const response = await get(`/mentors/${mentorId}/sessions/today`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch today's sessions: " + error.message);
  }
};

// Fetch recent messages
export const getRecentMessages = async (mentorId) => {
  try {
    const response = await get(`/mentors/${mentorId}/messages/recent`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch recent messages: " + error.message);
  }
};

// Fetch mentee progress
export const getMenteeProgress = async (mentorId) => {
  try {
    const response = await get(`/mentors/${mentorId}/mentees/progress`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch mentee progress: " + error.message);
  }
};

// Fetch shared resources
export const getSharedResources = async (mentorId) => {
  try {
    const response = await get(`/mentors/${mentorId}/resources/shared`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch shared resources: " + error.message);
  }
};

// Fetch upcoming reports
export const getUpcomingReports = async (mentorId) => {
  try {
    const response = await get(`/mentors/${mentorId}/reports/upcoming`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch upcoming reports: " + error.message);
  }
};

// Fetch mentee industries
export const getIndustries = async (mentorId) => {
  try {
    const response = await get(`/mentors/${mentorId}/industries`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch industries: " + error.message);
  }
};

// Fetch recent achievements
export const getRecentAchievements = async (mentorId) => {
  try {
    const response = await get(`/mentors/${mentorId}/achievements`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch achievements: " + error.message);
  }
};
