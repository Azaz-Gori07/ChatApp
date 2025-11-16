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

export const createGroupConversation = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    if (!name || !members?.length)
      return res.status(400).json({ message: "Name & members required" });

    const newConversation = await Conversation.create({
      name,
      isGroup: true,
      members: [req.user.id, ...members]
    });

    res.json(newConversation);
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

export const addMember = async (req, res, next) => {
  try {
    const { id } = req.params; // conversationId
    const { userId } = req.body;

    const conv = await Conversation.findById(id);
    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    if (!conv.isGroup)
      return res.status(400).json({ message: "This is not a group" });

    if (conv.members.includes(userId))
      return res.json({ message: "Already a member" });

    conv.members.push(userId);
    await conv.save();

    res.json({ message: "Member added", conversation: conv });
  } catch (err) {
    next(err);
  }
};


export const removeMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const conv = await Conversation.findById(id);
    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    conv.members = conv.members.filter((m) => m.toString() !== userId);
    await conv.save();

    res.json({ message: "Member removed", conversation: conv });
  } catch (err) {
    next(err);
  }
};


export const renameConversation = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const conv = await Conversation.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    res.json(conv);
  } catch (err) {
    next(err);
  }
};

