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
