import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/image", authMiddleware, uploadImage);

export default router;
