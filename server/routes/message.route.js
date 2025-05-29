import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlware.js";
import {
  getMessages,
  sendMessage,
  sendFileMessage,
} from "../controllers/message.controller.js";
import { upload } from "../middlewares/fileUpload.middleware.js";

const router = express.Router();

router.post("/send/:receiverId", isAuthenticated, sendMessage);
router.post(
  "/send-file/:receiverId",
  isAuthenticated,
  upload.single("file"),
  sendFileMessage
);
router.get("/get-messages/:otherParticipantId", isAuthenticated, getMessages);

export default router;
