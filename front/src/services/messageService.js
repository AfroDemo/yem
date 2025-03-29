import api from '../utils/api';

// Create conversation
export const createConversation = async (conversationData: {
  participants: string[];
  title?: string;
}) => {
  try {
    const response = await api.post('/conversations', conversationData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create conversation';
  }
};

// Get conversations by user
export const getConversationsByUser = async () => {
  try {
    const response = await api.get('/conversations/user');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get conversations';
  }
};

// Get conversation by ID
export const getConversationById = async (conversationId: string) => {
  try {
    const response = await api.get(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get conversation';
  }
};

// Update conversation
export const updateConversation = async (conversationId: string, conversationData: {
  title?: string;
}) => {
  try {
    const response = await api.put(`/conversations/${conversationId}`, conversationData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update conversation';
  }
};

// Add participant to conversation
export const addParticipant = async (conversationId: string, participantId: string) => {
  try {
    const response = await api.post(`/conversations/${conversationId}/participants`, { participantId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add participant';
  }
};

// Leave conversation
export const leaveConversation = async (conversationId: string) => {
  try {
    const response = await api.delete(`/conversations/${conversationId}/leave`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to leave conversation';
  }
};

// Send message
export const sendMessage = async (messageData: {
  conversationId: string;
  content: string;
}) => {
  try {
    const response = await api.post('/messages', messageData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send message';
  }
};

// Get messages by conversation
export const getMessagesByConversation = async (conversationId: string) => {
  try {
    const response = await api.get(`/messages/conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get messages';
  }
};

// Delete message
export const deleteMessage = async (messageId: string) => {
  try {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete message';
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId: string) => {
  try {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to mark message as read';
  }
};
