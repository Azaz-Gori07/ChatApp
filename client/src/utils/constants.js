export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_CONVERSATION: 'join_conversation',
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
};

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    SEND_OTP: '/auth/send-otp',       // Add this
    VERIFY_OTP: '/auth/verify-otp',
  },
  USERS: {
    ME: '/users/me',
    UPDATE: '/users/update',
    ALL: '/users',
    SEARCH: '/users/search',
  },
  CONVERSATIONS: {
    BASE: '/conversations',
    GROUP: '/conversations/group',
  },
  MESSAGES: {
    BASE: '/messages',
    BY_CONVERSATION: '/messages',
  },
  UPLOAD: {
    IMAGE: '/upload/image',
    PRESIGN: '/upload/presign',
  },
};