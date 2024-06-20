import { Router } from "express";
import verifyUser from "../middleware/verifyUser.js";
import { sendMessage } from "../controllers/message.controllers.js";


const router = Router();

router.post("/", verifyUser, sendMessage);


export default router;