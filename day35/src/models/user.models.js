import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
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

const userModel = mongoose.model("user", userSchema);

export default userModel