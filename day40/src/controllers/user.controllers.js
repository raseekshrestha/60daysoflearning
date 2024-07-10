import asyncHandler from "express-async-handler";
import userModel from "../models/user.models.js";
import { generateJwt, makeResponse } from "../helpers/helperFunctions.js";

const createUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const usrCount = await userModel.countDocuments({ username })
    if (usrCount > 0) {
        return res.status(400).json(makeResponse("s", "username already registered"))
    }
    try {
        const result = await userModel.create({
            username, password, profilePic: `https://api.multiavatar.com/${username}.svg`
        })

        const result1 = await userModel.findOne({ _id: result._id }).select("-password")

        res.json(makeResponse("s", "User Registered Successfully", result1))

    } catch (err) {
        console.log("error occured", err)
        return res.status(500).json({ err })
    }


})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) return res.status(400).json(makeResponse("f", "oldPassword and newPassword Required"))
    if (oldPassword == newPassword) return res.status(400).json(makeResponse("f", "old and new password cannot be same"))

    const user = await userModel.findOne({ _id: req.user._id })
    if (await user.matchPassword(oldPassword)) {
        user.password = newPassword
        user.save()
        return res.json(makeResponse("s", "Password Changed!"))
    } else {
        res.status(401).json(makeResponse("f", "old password invalid"));
    }
})



const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({ username })
    if (user && await user.matchPassword(password)) {
        const tokenPayload = { _id: user._id }
        const message = "Login Success"
        const token = await generateJwt(tokenPayload)
        const selectedFields = await userModel.findOne({ username }).select("-password")
        res.json({ status: "ok", message, token, user: selectedFields })
    } else {
        res.status(401).json(makeResponse("f", "username or password invalid"))
    }
})



export { createUser, changePassword, loginUser }