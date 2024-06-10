import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    }
})

const userModel = mongoose.model("user", userSchema);


export { userModel };

