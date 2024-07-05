import express from 'express';
import validateUser from '../middleware/validateUser.js';
import fieldValidator from '../middleware/fieldValidator.js';
import { commentOnBlog, getCommentOnBlog } from '../controllers/comment.controllers.js';


const router = express.Router();

router.post("/:blogId", validateUser, fieldValidator(['content']), commentOnBlog);

router.get("/:blogId", getCommentOnBlog);


export default router;