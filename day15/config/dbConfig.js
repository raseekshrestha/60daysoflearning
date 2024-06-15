import mongoose from "mongoose";


async function dbConnect() {
    const dbHost = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/temp";
    console.log(dbHost)
    mongoose.connect(dbHost).then(data => {
        console.log("mongodb connected")
    }).catch(err => {
        console.log(err)
    })

}

export default dbConnect;