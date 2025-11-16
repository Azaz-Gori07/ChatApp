import { io } from 'socket.io-client';
import { ENV } from '../config/env.js';
import { SOCKET_EVENTS } from '../utils/constants.js';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(ENV.API_BASE_URL.replace('/api', ''), {
      auth: { token },
    });

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('✅ Socket connected');
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('❌ Socket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversationId);
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
    }
  }

  typing(data) {
    if (this.socket) {
      this.socket.emit(SOCKET_EVENTS.TYPING, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      if (this.listeners.has(event)) {
        const listeners = this.listeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }
}

export const socketService = new SocketService();