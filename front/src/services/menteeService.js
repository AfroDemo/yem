import { get } from "../utils/api";

// Fetch dashboard metrics (active mentors, upcoming sessions, hours mentored, average mentor rating)
export const getMenteeDashboardMetrics = async (menteeId) => {
  try {
    const response = await get(`/mentees/${menteeId}/dashboard-metrics`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch dashboard metrics: " + error.message);
  }
};

// Fetch today's sessions
export const getTodaysSessions = async (menteeId) => {
  try {
    const response = await get(`/mentees/${menteeId}/sessions/today`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch today's sessions: " + error.message);
  }
};

// Fetch recent messages
export const getRecentMessages = async (menteeId) => {
  try {
    const response = await get(`/mentees/${menteeId}/messages/recent`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch recent messages: " + error.message);
  }
};

// Fetch mentee progress
export const getMenteeProgress = async (menteeId) => {
  try {
    const response = await get(`/mentees/${menteeId}/progress`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch mentee progress: " + error.message);
  }
};

// Fetch shared resources
export const getSharedResources = async (menteeId) => {
  try {
    const response = await get(`/mentees/${menteeId}/resources/shared`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch shared resources: " + error.message);
  }
};

// Fetch upcoming reports
export const getUpcomingReports = async (menteeId) => {
  try {
    const response = await get(`/mentees/${menteeId}/reports/upcoming`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch upcoming reports: " + error.message);
  }
};

// Fetch new connections (to support ConnectionCard)
export const getNewConnections = async (menteeId) => {
  try {
    const response = await get(`/mentees/${menteeId}/connections/new`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch new connections: " + error.message);
  }
};
