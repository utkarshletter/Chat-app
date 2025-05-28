import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5000'],
    methods: ["GET", "POST"],
    credentials: true,
  }
});

const userSocketmap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
  const socketId = userSocketmap[receiverId];
  return socketId;
};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`User connected with userId: ${userId}, socketId: ${socket.id}`);

  if (userId && userId !== "undefined") {
    // Store userId as string (just in case)
    const normalizedUserId = String(userId);
    userSocketmap[normalizedUserId] = socket.id;

    
  } else {
    console.log("No valid userId in handshake query:", userId);
  }

  // Broadcast current online users
  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    if (userId) {
      const normalizedUserId = String(userId);
      delete userSocketmap[normalizedUserId];
      io.emit('getOnlineUsers', Object.keys(userSocketmap));
    }
  });
});

export { app, io, server };
