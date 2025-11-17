import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { initSocket } from "./socket/socket.js";

// ----------------------------
// Create HTTP Server
// ----------------------------
const server = http.createServer(app);

// ----------------------------
// Setup Socket.IO
// ----------------------------
const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

// Initialize socket listeners
initSocket(io);

// ----------------------------
// Connect to MongoDB
// ----------------------------
connectDB();

const PORT = ENV.PORT || process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

