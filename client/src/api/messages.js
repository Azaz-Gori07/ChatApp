import axios from "./axiosInstance";

// Send text message
export const sendMessage = async (data) => {
  return axios.post("/messages", data);
};

// Edit a message
export const editMessage = async (messageId, data) => {
  return axios.put(`/messages/${messageId}`, data);
};

// Delete a message
export const deleteMessage = async (messageId) => {
  return axios.delete(`/messages/${messageId}`);
};

// Mark conversation messages as read
export const markAsRead = async (conversationId) => {
  return axios.post(`/messages/${conversationId}/read`);
};
