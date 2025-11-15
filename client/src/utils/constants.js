export const API_BASE_URL = "http://localhost:5000/api";

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  NEW_MESSAGE: "new_message",
  SEND_MESSAGE: "send_message",
  TYPING: "typing",
};

export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Regex patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
