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
    if (startTime < now || endTime <= startTime) {
      throw new Error(
        "Invalid session times: Start time must be in the future and before end time"
      );
    }

    const { data } = await post("/sessions", {
      ...rest,
      mentorId,
      menteeId,
      topic: title,
      startTime,
      endTime,
    });

    // Associate resources if provided
    if (resourceIds?.length) {
      await post(`/sessions/${data.id}/resources`, { resourceIds });
    }

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
    if (startTime < now || endTime <= startTime) {
      throw new Error(
        "Invalid session times: Start time must be in the future and before end time"
      );
    }

    const { data } = await put(`/sessions/${sessionId}`, {
      ...rest,
      mentorId,
      menteeId,
      topic: title,
      startTime,
      endTime,
    });

    // Update resources
    await post(`/sessions/${sessionId}/resources`, {
      resourceIds: resourceIds || [],
    });

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
