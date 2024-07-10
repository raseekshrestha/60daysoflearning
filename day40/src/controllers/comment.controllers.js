import asyncHandler from "express-async-handler";
import commentModel from "../models/comments.models.js";
import { makeResponse } from "../helpers/helperFunctions.js";


const commentOnBlog = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const blogId = req.params.blogId;

    try {
        const comment = await commentModel.create({ blog: blogId, commentor: req.user._id, content });
        if (comment) {
            res.json(makeResponse("s", "comment added", comment));
        } else {
            res.status(500).json(makeResponse("f", "failed to add comment"))
        }
    } catch (err) {
        res.status(500).json(makeResponse("f", err?.message || "unknnown error occured"))
    }

})

const getCommentOnBlog = asyncHandler(async (req, res) => {
    const blogId = req.params.blogId;
    const comments = await commentModel.find({ blog: blogId }).sort({ createdAt: -1 }).populate("commentor", "username profilePic")
    res.json(makeResponse("s", "comments fetched", comments))
})


export { commentOnBlog, getCommentOnBlog };