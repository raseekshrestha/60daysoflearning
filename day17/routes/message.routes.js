import { Router } from "express";
import verifyUser from "../middleware/verifyUser.js";
import { sendMessage, getMessages } from "../controllers/message.controllers.js";


const router = Router();

router.post("/", verifyUser, sendMessage);
router.get("/:chatId", getMessages);





export default router;