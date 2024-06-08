import { Router } from 'express';
import { changePassword, createUser, loginUser } from '../controllers/users.controllers.js';
import validateUser from '../middlewares/validateUser.middlewares.js';
import fieldValidator from '../middlewares/fieldValidator.middlewares.js';

const router = Router();

router.post("/register", fieldValidator(['username', 'password']), createUser);
router.post("/login", fieldValidator(['username', 'password']), loginUser);
router.post("/changepassword", validateUser, fieldValidator(['oldPassword', 'newPassword']), changePassword);


export default router;