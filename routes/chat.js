import express from "express"
import { getChatMessages, createChatMessage } from "../controllers/chatController.js"
import { optionalProtect } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.route("/").post(optionalProtect, createChatMessage)

router.route("/:sessionId").get(getChatMessages)

export default router
