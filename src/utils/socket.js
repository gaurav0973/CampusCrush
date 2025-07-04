import { Server } from "socket.io";

export const initialiseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("-");
      console.log(`User ${userId} joined room ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("-");
      console.log(`Message from ${firstName} in room ${roomId}: ${text}`);

      const message = {
        id: Date.now().toString(), // Simple unique ID
        firstName,
        userId,
        targetUserId,
        text,
        timestamp: new Date().toISOString(),
        roomId,
      };

      io.to(roomId).emit("messageReceived", message);
      console.log(`Message emitted to room ${roomId}:`, message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io; 
};
