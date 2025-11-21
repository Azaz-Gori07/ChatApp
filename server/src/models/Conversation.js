import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: String },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
