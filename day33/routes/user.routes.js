import express from 'express';
import { loginUser, registerUser } from '../controllers/user.controllers.js';
import { fieldValidator } from '../middlewares/fieldValidator.middlewares.js';

const router = express.Router();


router.post("/register", fieldValidator(['email', 'password', 'confirmPassword']), registerUser);
router.post("/login", fieldValidator(['email', 'password']), loginUser);

export default router;