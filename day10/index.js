import mongoose from "mongoose";
import { userModel } from "./models/users.models.js";
import { subscriptionModel } from "./models/subscriptions.models.js";


const connect = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/")
        console.log("connected to mongodb")
        return true
    }
    catch (err) {
        console.log("error monodb", err)
        return false
    }

}

const main = async () => {

    if (!await connect()) {
        process.exit()
    }

    // insert some data
    // const names = ['ram', 'shyam', 'hari']

    // for (let name of names) {
    //     const n1 = await userModel.create({ name })
    //     console.log(n1)

    // }

    // subscribe
    // const s1 = await subscriptionModel.create({ subscriber: "6666fe98c1833210f823999c", channel: "6666fe98c1833210f823999e" })
    // const s2 = await subscriptionModel.create({ subscriber: "6666fe98c1833210f823999c", channel: "6666fe98c1833210f82399a0" })
    // console.log(s1)
    // console.log(s2)

    // aggregation pipelines
    const data = await userModel.aggregate([
        {
            $match: {
                name: "shyam"
            }
        },

        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                }
            }
        }
        , {
            $project: {
                subscribers: 0,
                subscribedTo: 0
            }
        }

    ])

    console.log(data)


}

main()