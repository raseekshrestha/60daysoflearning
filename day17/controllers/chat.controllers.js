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

const createGroupChat = asyncHandler(async (req, resp) => {
    if (!req.body.users || !req.body.name) {
        throw new ApiError(400, "list of users and name is required");
    }
    const users = req.body.users

    if (users.length < 2) {
        throw new ApiError(400, 'more than 2 users are required to make a group');
    }
    users.push(req.user);
    // console.log(users)

    try {
        const groupChat = await chatModel.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const fullgroupChat = await chatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        return resp.json(new ApiResponse(200, "group creation successful", fullgroupChat))
    } catch (err) {
        console.log(err)
        throw new ApiError(400, "failed to create group");
    }

})

// PUT: renaming group
const renameGroupChat = asyncHandler(async (req, resp) => {
    const { groupId, name } = req.body
    if (!groupId || !name) {
        throw new ApiError(400, "groupId and name should be provided")
    }
    const groupChat = await chatModel.findByIdAndUpdate({ _id: groupId }, { chatName: name }, { new: true })
    resp.json(new ApiResponse(200, "renamed successful", groupChat))

})

// PUT: adding or removing  member from grup
const addOrRemoveMemberFromGroup = asyncHandler(async (req, resp) => {
    // action = "add" or "remove"
    const { groupId, userId, action } = req.body;
    if (!groupId || !userId || !action) {
        throw new ApiError(400, "groupId, userId and action required")
    }
    const groupChat = await chatModel.findOne({ _id: groupId });
    let modified;

    // $push and $pull for adding and removing user from the group chat
    const updateAction = action === "add" ? "$push" : "$pull";
    const dynamicUpdateQuery = { [updateAction]: { users: userId } }

    if (action === "add") {
        if (groupChat.users.includes(userId)) {
            throw new ApiError(400, "User already this group")
        }

    } else {
        // removing user part
        if (!groupChat.users.includes(userId)) {
            throw new ApiError(400, "User not in group!");
        }
    }
    modified = await chatModel.findByIdAndUpdate({ _id: groupId }, dynamicUpdateQuery, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!modified) {
        throw new ApiError(500, `failed to ${action} user`)
    } else {
        resp.json(new ApiResponse(200, `User ${action == "add" ? "added" : "removed"} successfully`, modified))
    }
})


export { getChatById, fetchChats, createGroupChat, renameGroupChat, addOrRemoveMemberFromGroup }