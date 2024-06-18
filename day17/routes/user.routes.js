
import { Router } from "express";
import { registerUser, loginUser, searchUser } from "../controllers/user.controllers.js";
import verifyUser from "../middleware/verifyUser.js";

const router = Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/search", verifyUser, searchUser);



export default router