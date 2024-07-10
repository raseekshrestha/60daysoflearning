import express from 'express';
import {
    createBlog,
    deleteBlogById,
    getAllBLogs,
    getBlogById,
    updateBlogById,
    countBlogs
} from '../controllers/post.controllers.js';
import validateUser from '../middleware/validateUser.js';

const router = express.Router();

// create post
router.post("/", validateUser, createBlog);
router.get("/", getAllBLogs);

router.get("/countblogs", countBlogs);

router.get("/:blogId", getBlogById);

router.delete("/:blogId", validateUser, deleteBlogById);

router.put("/:blogId", validateUser, updateBlogById);


export default router;


