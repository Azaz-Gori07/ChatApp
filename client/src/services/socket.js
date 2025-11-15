import { io } from "socket.io-client";

let socket = null;

/**
 * Initialize socket with JWT token.
 * Called inside SocketContext.
 */
export const connectSocket = (token) => {
  socket = io("http://localhost:5000", {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  return socket;
};

/** Get active socket instance */
export const getSocket = () => socket;

/** Disconnect socket */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
