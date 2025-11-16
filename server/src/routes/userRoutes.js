import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile, getAllUsers, searchUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);
router.get("/", authMiddleware, getAllUsers);
router.get("/search", authMiddleware, searchUsers);



export default router;
