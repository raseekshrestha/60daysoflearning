
import asyncHandler from 'express-async-handler';
import blogModel from '../models/blog.models.js';
import { makeResponse } from '../helpers/helperFunctions.js';

const createBlog = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    const query = {
        title,
        content,
        author: req.user ? req.user._id : null
    }
    try {
        const blog = await blogModel.create(query);
        if (blog) {
            return res.json(makeResponse("s", "Blog Created successfully", blog))
        } else {
            return res.status(500).json(makeResponse("f", "failed to create new blog"))
        }
    } catch (err) {
        console.log(err)
        throw new Error(err?.message || "unknown error occured while creating blog")
    }
})

const getAllBLogs = asyncHandler(async (req, res) => {
    const { pagenumber, blogperpage } = req.query

    const offset = (pagenumber - 1) * blogperpage

    try {
        const blogs = await blogModel.find().sort({ createdAt: -1 }).skip(offset).limit(blogperpage).populate("author", "username")
        res.json(makeResponse("s", "All blog available are here", blogs))
    } catch (err) {
        throw new Error(err?.message || "unknown error occured while fetchin blogs")
    }
})

const getBlogById = asyncHandler(async (req, res) => {
    const blogId = req.params.blogId;

    try {
        const blog = await blogModel.findOne({ _id: blogId });
        if (!blog) {
            return res.status(404).json(makeResponse("f", "No blog exists with that Id"))
        }
        res.json(makeResponse("s", "Blog fetched successfully", blog))

    } catch (err) {
        throw new Error(err?.message || "unknown error occured while fetching blog")

    }
})

const deleteBlogById = asyncHandler(async (req, res) => {
    const blogId = req.params.blogId;

    try {
        const blog1 = await blogModel.findOne({ _id: blogId });
        if (!blog1.author.equals(req.user._id)) {
            return res.status(403).json(makeResponse("f", "Not Your post to delete"))
        }
        const blog = await blogModel.deleteOne({ _id: blogId });
        if (blog.deletedCount == 1) {
            res.status(204).json(makeResponse("s", "Successfully deleted"))
        }
        else {
            res.status(400).json(makeResponse("f", "NO such blog with that id"))
        }

    } catch (err) {
        throw new Error(err?.message || "Unknown err while deleting");
    }

})

const updateBlogById = asyncHandler(async (req, res) => {
    const blogId = req.params.blogId;

    const { title, content } = req.body;

    try {
        const blog = await blogModel.findOneAndUpdate({ _id: blogId, author: req.user._id }, { title, content }, { new: true });
        if (blog) {
            res.json(makeResponse("s", "blog updated successfully", blog))
        } else {
            res.status(403).json(makeResponse("f", "not your blog to update/edit"))
        }
    }
    catch (err) {
        throw new Error(err?.message || "error updating blog");
    }

})


const countBlogs = asyncHandler(async (req, res) => {
    try {
        const totalBlogCount = await blogModel.countDocuments({});
        return res.json({ totalBlogs: totalBlogCount });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: "Error fetching blog count" }); // Send a generic error response
    }
});

export { createBlog, getAllBLogs, getBlogById, deleteBlogById, updateBlogById, countBlogs };