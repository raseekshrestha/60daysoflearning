import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
    },
    commentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    content: {
        type: String
    }
}, { timestamps: true })

const commentModel = mongoose.model("comment", commentSchema);


export default commentModel