import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getConversations,
  createConversation,
  createGroupConversation,
  addMember,
  removeMember,
  renameConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", authMiddleware, getConversations);
router.post("/", authMiddleware, createConversation);
router.post("/group", authMiddleware, createGroupConversation);
router.post("/:id/add-member", authMiddleware, addMember);
router.post("/:id/remove-member", authMiddleware, removeMember);
router.patch("/:id/rename", authMiddleware, renameConversation);





export default router;
