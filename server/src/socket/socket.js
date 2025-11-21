import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";

export const initSocket = (io) => {
  // Middleware for authenticating socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
      socket.userId = decoded.id; // Attach user ID to the socket object
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log("🔥 User connected:", socket.id, "userId:", socket.userId);

    // User joins room = conversation
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // Handle sending messages
    socket.on("send_message", async (data) => {
      const { conversationId, senderId, content, type } = data;

      const msg = await Message.create({
        conversationId,
        senderId,
        content,
        type: type || "text",
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: content,
        updatedAt: new Date(),
      });

      // Send message to all users in the room
      io.to(conversationId).emit("new_message", msg);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id, "userId:", socket.userId);
    });
  });
};
