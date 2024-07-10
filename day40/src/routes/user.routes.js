import express from "express";
import { createUser, changePassword, loginUser } from "../controllers/user.controllers.js";
import fieldValidator from "../middleware/fieldValidator.js";
import validateUser from "../middleware/validateUser.js";


const router = express.Router();


router.post("/register", fieldValidator(['username', 'password']), createUser);

router.put("/changepassword/", fieldValidator(['oldPassword', 'newPassword']), validateUser, changePassword);


router.post("/login", fieldValidator(['username', 'password']), loginUser);




export default router;