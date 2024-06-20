
import asyncHandler from 'express-async-handler';
import { userModel } from '../models/user.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';



const registerUser = asyncHandler(async (req, resp) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        resp.status(400);
        throw new Error("please enter all the required fields");
    }

    const userExists = await userModel.findOne({ email })
    if (userExists) {
        return resp.status(400).json({ message: "User already exists" });
    }

    const user = await userModel.create({
        username,
        email,
        password,
    });
    if (user) {
        resp.json(new ApiResponse(201, "Login Registration Successful"))
    } else {
        resp.status(400);
        resp.json(new ApiError(400, "user register failed"))
    }

})

const loginUser = asyncHandler(async (req, resp) => {
    const { username, password } = req.body
    if (!username || !password) {
        throw new ApiError(400, "missing username or password");
    }
    const user = await userModel.findOne({ username })
    if (user && (await user.matchPassword(password))) {
        const data = {
            _id: user._id,
            username: user.username,
            email: user.email,
            token: user.generateToken({ _id: user._id })
        }
        resp.status(200).json(new ApiResponse(200, "Login successful", data))
    } else {
        throw new ApiError(400, "username or password error")
    }
})

const searchUser = asyncHandler(async (req, resp) => {
    const keyword = req.query.search ? {
        $or: [
            {
                username: { $regex: req.query.search, $options: "i" },
                _id: { $ne: req.user._id }
            },
            {
                email: { $regex: req.query.search, $options: "u" }
            }
        ]
    } : {};

    try {
        const users = await userModel.find(keyword).select(["-password", "-__v"])
        resp.json(new ApiResponse(200, "users", users))

    } catch (error) {
        throw new ApiError(500, error.message)
    }

})


export { registerUser, loginUser, searchUser }