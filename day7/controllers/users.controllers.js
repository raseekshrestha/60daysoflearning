import asyncHandler from "express-async-handler";
import userModel from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const usrCount = await userModel.countDocuments({ username })
    if (usrCount > 0) {
        throw new ApiError(400, "email already registered")
    }
    const result = await userModel.create({
        username, password, profilePic: `https://api.multiavatar.com/${username}.svg`
    })

    res.json(new ApiResponse(201, "User Registered Successfully"))
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "oldPassword and newPassword Required");
    }
    if (oldPassword == newPassword) {
        throw new ApiError(400, "old and new password cannot be same");
    }

    const user = await userModel.findOne({ _id: req.user._id })
    if (await user.matchPassword(oldPassword)) {
        user.password = newPassword
        user.save()
        return res.json(new ApiResponse(200, "Password Changed!"))
    } else {
        throw new ApiError(401, "old password invalid");
    }
})




const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({ username })
    if (user && await user.matchPassword(password)) {
        const token = user.generateToken()
        const selectedFields = await userModel.findOne({ username }).select("-password")

        res.json(new ApiResponse(200, "Login success", { token: token, ...selectedFields._doc }))
    } else {
        throw new ApiError(401, "username or password invlaid")
    }
})



export { createUser, loginUser, changePassword }