
import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

const userModel = mongoose.model("User", userSchema);

export { userModel };
