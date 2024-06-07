import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://api.multiavatar.com/default.svg",
    },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id }, "secretkey", { expiresIn: "1d" })
    return token
}

const userModel = mongoose.model("user", userSchema);

export default userModel