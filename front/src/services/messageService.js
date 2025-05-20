import { get, post } from "../utils/api";

export const messageService = {
  // Get or create a conversation with a user
  async getOrCreateConversation(userId) {
    try {
      // Validate input
      if (!userId || typeof userId !== "number") {
        throw new Error("Invalid user ID");
      }

      // Make API call to create or retrieve conversation
      const response = await post("/conversations", {
        participantId: userId,
      });

      // Validate response
      if (!response || !response.data) {
        throw new Error("Invalid server response");
      }

      return response.data;
    } catch (error) {
      // Comprehensive error handling
      console.error("Conversation creation error:", error);

      // Prioritize server-provided error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get or create conversation";

      throw {
        error: errorMessage,
        status: error.response?.status || 500,
      };
    }
  },

  // Send a message
  async sendMessage(conversationId, content) {
    try {
      const response = await post("/conversations/message", {
        conversationId,
        content,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to send message" };
    }
  },

  // Get all conversations for the current user
  async getConversations() {
    try {
      const response = await get("/conversations");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch conversations" };
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId) {
    try {
      const response = await get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch messages" };
    }
  },

  // Search for users with active mentorships
  async searchMentorshipConnections(query) {
    try {
      const response = await get(
        `/users/search?query=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to search connections" };
    }
  },
};
