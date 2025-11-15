import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [typingEvent, setTypingEvent] = useState(null);

  // -----------------------------------
  // Connect socket when user logs in
  // -----------------------------------
  useEffect(() => {
    // Disconnect existing socket if user logs out or changes
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      setIsConnected(false);
    }

    if (!user) {
      return; // Don't connect if no user
    }

    // Create socket connection
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("No access token found, socket may not authenticate");
      return;
    }

    socketRef.current = io("http://localhost:5001", {
      auth: {
        token: token, // send JWT to server
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5, // Limit reconnection attempts
      reconnectionDelay: 2000,
    });

    // -----------------------------------
    // EVENT: Connected
    // -----------------------------------
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("🔌 Socket connected:", socketRef.current.id);
    });

    // -----------------------------------
    // EVENT: Disconnected
    // -----------------------------------
    socketRef.current.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("❌ Socket disconnected:", reason);
    });

  // -----------------------------------
    // EVENT: Connect Error
  // -----------------------------------
     socketRef.current.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
    });
  // -----------------------------------
    // EVENT: Incoming message
  // -----------------------------------
    socketRef.current.on("new_message", (message) => {
      console.log("📩 Received:", message);
      setIncomingMessage(message);
    });

    // -----------------------------------
    // EVENT: Typing indicator
    // -----------------------------------
    socketRef.current.on("typing", (data) => {
      setTypingEvent(data);
    });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
  };
  }, [user]); // Only re-run when user changes

  // -----------------------------------
  // Send Message to Server
  // -----------------------------------
  const sendMessage = (msgData) => {
    if (!socketRef.current) return;

    socketRef.current.emit("send_message", msgData);
};

  // -----------------------------------
  // Send Typing Event
  // -----------------------------------
  const sendTyping = (data) => {
    if (!socketRef.current) return;

    socketRef.current.emit("typing", data);
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        incomingMessage,
        typingEvent,
        sendMessage,
        sendTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Easy Hook
export const useSocket = () => useContext(SocketContext);
