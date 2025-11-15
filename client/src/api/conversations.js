import axios from "./axiosInstance";

// Get all conversations for logged user
export const getConversations = async () => {
  return axios.get("/conversations");
};

// Get a single conversation messages (pagination supported)
export const getConversationMessages = async (conversationId, params = {}) => {
  return axios.get(`/conversations/${conversationId}/messages`, { params });
};

// Create new conversation (1:1 or group)
export const createConversation = async (data) => {
  return axios.post("/conversations", data);
};

// Add member to group conversation
export const addMember = async (conversationId, userId) => {
  return axios.post(`/conversations/${conversationId}/members`, { userId });
};

// Remove member
export const removeMember = async (conversationId, userId) => {
  return axios.delete(`/conversations/${conversationId}/members/${userId}`);
};
