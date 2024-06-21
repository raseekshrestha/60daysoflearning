import asyncHandler from "express-async-handler";
import { messageModel } from '../models/message.models.js'
import { ApiError } from "../utils/ApiError.js";
import { chatModel } from "../models/chat.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const sendMessage = asyncHandler(async (req, resp) => {
    // get sender from req.user
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        throw new ApiError(400, "content and chatId are required")
    }
    const newMessage = {
        sender: req.user._id,
        content,
        chat: chatId
    };

    try {
        let msg = await messageModel.create(newMessage);
        msg = await msg.populate([
            {
                path: "sender",
                select: "username email pic",
            },
            {
                path: "chat",
                populate: {
                    path: "users",
                    select: "email username pic",
                }
            }
        ])

        await chatModel.findOneAndUpdate({ _id: chatId }, {
            latestMessage: msg
        })
        resp.json(new ApiResponse(200, "sent successful", msg));
    } catch (err) {
        throw new ApiError(500, "failed sending message");
    }

})

const getMessages = asyncHandler(async (req, resp) => {
    const chatId = req.params.chatId;

    try {
        const messages = await messageModel.find({ chat: chatId }).populate([
            {
                path: "sender",
                select: "username email pic"
            },
            {
                path: "chat",
            }
        ]);
        resp.json(new ApiResponse(200, "messages", messages));
    } catch (err) {
        console.log(err)
        // resp.status(500).json(makeResponse("f", "error fetching )
        throw new ApiError(500, "error fetching messages")
    }
})

export { sendMessage, getMessages };