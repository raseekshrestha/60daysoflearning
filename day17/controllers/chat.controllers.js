import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { chatModel } from "../models/chat.models.js";
import { userModel } from "../models/user.models.js";

const getChatById = asyncHandler(async (req, resp) => {
    const userId = req.params.userId;
    if (!userId) {
        throw new ApiError(400, "userId  missing")
    }
    let isChat = await chatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await userModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "username pic email"
    })

    if (isChat.length > 0) {
        resp.json(new ApiResponse(200, "existing chat", isChat[0]));
    } else {
        // create new chat with userId and req.user._id
        const chatData = {
            isGroupChat: false,
            chatName: "personal chat",
            users: [req.user._id, userId]
        }
        const createdChat = await chatModel.create(chatData);
        const fullchat = await chatModel.findOne({ _id: createdChat._id }).populate("users", "-password")

        resp.status(201).json(new ApiResponse("201", "created a new chat", fullchat))
    }

})

// fetch the chat where userid is associated with the current user
const fetchChats = asyncHandler(async (req, resp) => {
    try {
        let chat = await chatModel.find({
            users: { $elemMatch: { $eq: req.user._id } }
        }).populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })

        chat = await userModel.populate(chat, {
            path: "latestMessage.sender",
            select: "username email pic"
        })
        resp.json(new ApiResponse(200, "chats", chat))

    } catch (err) {
        throw new ApiError(400, err.message || "something went wrong")
    }
})


export { getChatById, fetchChats }