import mongoose, { mongo } from "mongoose";
import commentModel from "./comments.models.js";

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    }
}, { timestamps: true });


blogSchema.pre("deleteOne", async function (next) {
    const _id = this.getQuery()._id;
    await commentModel.deleteMany({ blog: _id }); //deletes comments on blog before deleting the blog itself
    next()
})

const blogModel = mongoose.model("blog", blogSchema);


export default blogModel;