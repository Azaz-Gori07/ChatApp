import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content, type } = req.body;

    const msg = await Message.create({
      senderId: req.userId,
      conversationId,
      content,
      type: type || "text",
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      updatedAt: new Date(),
    });

    res.json(msg);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    // Future: user-wise unread handling, abhi basic reset
    conv.unreadCount = 0;
    await conv.save();

    res.json({ message: "Marked as read" });
  } catch (err) {
    next(err);
  }
};

