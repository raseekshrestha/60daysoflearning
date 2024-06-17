
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/user.models");
const { ApiResponse } = require("../utils/ApiResponse")
const { ApiError } = require("../utils/ApiError")


const registerUser = asyncHandler(async (req, resp) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        resp.status(400);
        throw new Error("please enter all the required fields");
    }

    const userExists = await UserModel.findOne({ email })
    if (userExists) {
        // throw new Error("User already Exists")
        return resp.status(400).json({ message: "User already exists" });
    }

    const user = await UserModel.create({
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





module.exports = { registerUser }