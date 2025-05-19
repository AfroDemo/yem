import { get, post, put, del } from "../utils/api";

export const createSession = async (sessionData) => {
  try {
    const { data } = await post("/sessions", sessionData);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create session");
  }
};

export const getMentorSessions = async (mentorId) => {
  try {
    const { data } = await get(`/mentors/${mentorId}/sessions`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch sessions");
  }
};

export const updateSession = async (sessionId, sessionData) => {
  try {
    const { data } = await put(`/sessions/${sessionId}`, sessionData);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update session");
  }
};

export const deleteSession = async (sessionId) => {
  try {
    await del(`/sessions/${sessionId}`);
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete session");
  }
};

export const getMentees = async (mentorId) => {
  try {
    const { data } = await get(`/mentors/${mentorId}/mentees`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch mentees");
  }
};

export const getResources = async (mentorId) => {
  try {
    const { data } = await get(`/resources?createdById=${mentorId}`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch resources");
  }
};
