const mongoose = require("mongoose");
const colors = require("colors")


const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/chatapp")
        console.log(`connected to mongodb ${conn.connection.host}`.yellow.italic.bold)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB;