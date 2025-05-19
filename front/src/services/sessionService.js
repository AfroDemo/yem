import { get, post, put, del } from "../utils/api";

export const createSession = async (sessionData, user) => {
  try {
    const {
      dateTime,
      duration,
      title,
      menteeId,
      resourceIds,
      mentorId,
      ...rest
    } = sessionData;

    // Validate mentorId matches authenticated user
    if (mentorId !== user.id) {
      throw new Error(
        "Unauthorized: Mentor ID does not match authenticated user"
      );
    }

    // Validate session times
    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + duration * 60000);
    const now = new Date();
    if (startTime <= now || endTime <= startTime) {
      throw new Error(
        "Invalid session times: Start time must be in the future and before end time"
      );
    }

    const { data } = await post("/sessions", {
      ...rest,
      mentorId,
      menteeId,
      topic: title,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    // Associate resources if provided
    if (resourceIds?.length > 0) {
      await post(`/sessions/${data.id}/resources`, { resourceIds });
    }

    return data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to create session";
    const status = err.response?.status;
    if (status === 403)
      throw new Error(
        "Unauthorized: You are not allowed to create this session"
      );
    if (status === 400) throw new Error(message); // e.g., "No active mentorship found"
    throw new Error(message);
  }
};

export const getMentorSessions = async (mentorId) => {
  try {
    const { data } = await get(`/mentors/${mentorId}/sessions`);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to fetch sessions";
    if (err.response?.status === 403)
      throw new Error(
        "Unauthorized: You are not allowed to view these sessions"
      );
    throw new Error(message);
  }
};

export const updateSession = async (sessionId, sessionData, user) => {
  try {
    const {
      dateTime,
      duration,
      title,
      menteeId,
      resourceIds,
      mentorId,
      ...rest
    } = sessionData;

    // Validate mentorId matches authenticated user
    if (mentorId !== user.id) {
      throw new Error(
        "Unauthorized: Mentor ID does not match authenticated user"
      );
    }

    // Validate session times
    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + duration * 60000);
    const now = new Date();
    if (startTime <= now || endTime <= startTime) {
      throw new Error(
        "Invalid session times: Start time must be in the future and before end time"
      );
    }

    const { data } = await put(`/sessions/${sessionId}`, {
      ...rest,
      mentorId,
      menteeId,
      topic: title,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    // Update resources
    await post(`/sessions/${sessionId}/resources`, {
      resourceIds: resourceIds || [],
    });

    return data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to update session";
    const status = err.response?.status;
    if (status === 403)
      throw new Error(
        "Unauthorized: You are not allowed to update this session"
      );
    if (status === 404) throw new Error("Session not found");
    if (status === 400) throw new Error(message); // e.g., "Time conflict"
    throw new Error(message);
  }
};

export const deleteSession = async (sessionId) => {
  try {
    await del(`/sessions/${sessionId}`);
  } catch (err) {
    const message = err.response?.data?.message || "Failed to delete session";
    const status = err.response?.status;
    if (status === 403)
      throw new Error(
        "Unauthorized: You are not allowed to delete this session"
      );
    if (status === 404) throw new Error("Session not found");
    throw new Error(message);
  }
};

export const getMentees = async (mentorId) => {
  try {
    const { data } = await get(`/mentors/${mentorId}/mentees`);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to fetch mentees";
    if (err.response?.status === 403)
      throw new Error("Unauthorized: You are not allowed to view mentees");
    throw new Error(message);
  }
};

export const getResources = async (mentorId) => {
  try {
    const { data } = await get(`/resources?createdById=${mentorId}`);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to fetch resources";
    if (err.response?.status === 403)
      throw new Error(
        "Unauthorized: You are not allowed to view these resources"
      );
    throw new Error(message);
  }
};
