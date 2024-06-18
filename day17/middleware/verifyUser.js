import jwt from "jsonwebtoken";
import { userModel } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from 'express-async-handler';

const verifyUser = asyncHandler(async (req, resp, next) => {
    if (!req.headers.authorization) {
        throw new ApiError(401, "token not found")
    }

    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken)
    if (decodedToken) {
        req.user = await userModel.findOne({ _id: decodedToken._id });
        console.log(req.user)
        next();
    }
    else {
        throw new ApiError(401, "token invalid or expired")
    }
})

export default verifyUser;