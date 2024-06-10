import mongoose, { mongo } from "mongoose";

const subscriptionSchema = mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})


const subscriptionModel = mongoose.model("subscription", subscriptionSchema)

export { subscriptionModel };