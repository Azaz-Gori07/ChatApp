import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getMessages,
  sendMessage,
  markAsRead
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:conversationId", authMiddleware, getMessages);
router.post("/", authMiddleware, sendMessage);
router.post("/:id/read", authMiddleware, markAsRead);


export default router;
