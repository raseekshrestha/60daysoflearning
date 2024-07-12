import mongoose from "mongoose";

const uploadSchema = mongoose.Schema({
    filename: String,
    clientIp: String,

}, {
    timestamps: true
})

const uploadModel = mongoose.model("upload", uploadSchema)

export { uploadModel }