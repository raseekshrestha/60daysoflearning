import mongoose from "mongoose";


const dbConnnect = async () => {
    const dbname = process.env.NODE_ENV == "test" ? "testdb" : "blogpost"
    mongoose.connect(`mongodb://127.0.0.1:27017/${dbname}`)
        .then((data) => {
            console.log("connected to mongoose")
        })
        .catch(err => {
            console.log(err)
            console.log("db connection error")
        })
}

export { dbConnnect }