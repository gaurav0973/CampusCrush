import { Server } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.model.js";


const generateUniqueRoomId = (userId, targetUserId) => {
  const sortedIds = [userId, targetUserId].sort();
  return crypto.createHash("sha256").update(sortedIds.join("-")).digest("hex");
};

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
      const roomId = generateUniqueRoomId(userId, targetUserId);
      console.log(`User ${userId} joined room ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage",async ({ firstName, userId, targetUserId, text }) => {
      const roomId = generateUniqueRoomId(userId, targetUserId);
      console.log(`Message from ${firstName} in room ${roomId}: ${text}`);

      const message = {
        id: Date.now().toString(),
        firstName,
        userId,
        targetUserId,
        text,
        timestamp: new Date().toISOString(),
        roomId,
      };


      // save to database
      try {
        let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
        if(!chat){
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: []
          });
        }

        chat.messages.push({
          senderId : userId,
          text: text,
        });

        await chat.save();
        console.log("Message saved to database:", message);

      } catch (error) {
        console.error("Error saving message to database:", error);
        // return io.to(roomId).emit("error", { message: "Error saving message" });
      }

      io.to(roomId).emit("messageReceived", message);
      console.log(`Message emitted to room ${roomId}:`, message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io; 
};
