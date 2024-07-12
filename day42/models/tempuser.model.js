import mongoose from "mongoose";

const tempUserSchema = mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    uid: {
        type: Number
    },
    token: {
        type: String
    }
})

const tempUserModel = mongoose.model("tempuser", tempUserSchema);

export default tempUserModel;