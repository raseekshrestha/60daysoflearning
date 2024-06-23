import { Router } from 'express';
import verifyUser from '../middleware/verifyUser.js';
import { getChatById, fetchChats, createGroupChat, renameGroupChat } from '../controllers/chat.controllers.js';


const router = Router();

// /api/chats/:userId creates a new chat if not exists or returns existing chat betn (userId an req.user._id)
router.get("/", verifyUser, fetchChats);
router.get("/:userId", verifyUser, getChatById);

router.post("/group", verifyUser, createGroupChat);
router.put("/group/rename", verifyUser, renameGroupChat);


export default router;