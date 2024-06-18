
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    // console.log(!)
    if (!this.isModified()) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)


})

userSchema.methods.matchPassword = async function (pass) {
    return await bcrypt.compare(pass, this.password)
}

userSchema.methods.generateToken = function (payload) {
    return jwt.sign(payload, process.env.JWT_SECRET)
}

const userModel = mongoose.model("User", userSchema);

export { userModel };
