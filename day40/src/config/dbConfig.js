import mongoose from "mongoose";


const dbConnnect = async () => {
    const dbname = process.env.NODE_ENV == "test" ? "testdb" : "blogpost"
    mongoose.connect(process.env.MONGO_URI + dbname)
        .then((data) => {
            console.log("connected to mongoose")
        })
        .catch(err => {
            console.log(err)
            console.log("db connection error")
        })
}

export { dbConnnect }