import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";

export const getConversations = async (req, res, next) => {
  try {
    const list = await Conversation.find({ users: req.userId })
      .populate("users", "name avatar")
      .sort({ updatedAt: -1 });

    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { receiverId } = req.body;

    let convo = await Conversation.findOne({
      users: { $all: [req.userId, receiverId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        users: [req.userId, receiverId],
      });
    }

    res.json(convo);
  } catch (err) {
    next(err);
  }
};
