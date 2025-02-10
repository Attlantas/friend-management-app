import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";
import friendRoutes from './routes/friends.js';
import authRoutes from './routes/auth.js';
import errorHandler from "./middleware/errorHandler.js";
import User from './models/User.js';

dotenv.config();
const app = express();
const server = http.createServer(app); // ✅ Create HTTP server

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
});

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // ✅ Moved AFTER io setup
app.use(express.json());

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 WebSocket connected:", socket.id);

  socket.on("user_online", async (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online.`);

    const user = await User.findById(userId);

    if (user && user.pendingNotifications.length > 0) {
      user.pendingNotifications.forEach((notification) => {
        socket.emit(notification.type, notification.data);
      });

      user.pendingNotifications = [];
      await user.save();
    }
  });

  socket.on("user_offline", (userId) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.delete(userId);
      console.log(`User ${userId} is offline.`);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected.`);
        break;
      }
    }
  });
});

app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/friend_management";

mongoose.connect(MONGO_URI)
  .then(() => console.log("🚀 MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);

app.use(errorHandler);

// ✅ FIXED: Using `server.listen(PORT)` instead of `app.listen(PORT)`
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
