import express from "express";
import userAuth from "../middleware/auth.middleware.js";
import Chat from "../models/chat.model.js";
const chatRouter = express.Router();



chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const {targetUserId} = req.params;
        const userId = req.user._id;
        if (!targetUserId) {
            return res.status(400).json({ message: "Target user ID is required" });
        }
        // Fetch chat between logged in user and target user
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({
            path : 'messages.senderId',
            select: 'firstName lastName',
        });

        if(!chat) {
            // If no chat exists, create a new chat
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save();
        }

        res.status(200).json(chat);

    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


export default chatRouter;





