import mongoose from "mongoose";

const encryptSchema = mongoose.Schema({
    encryptedHex: {
        type: String,
    },
    name: {
        type: String
    }
})

const encryptModel = mongoose.model("encryptedpic", encryptSchema);

export default encryptModel;