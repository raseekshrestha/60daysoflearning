import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const db = await mongoose.connect("mongodb://localhost:27017/usersdba");
            console.log("Connected to MongoDB on", db.connection.host);
        } else {
            console.log("MongoDB already connected");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

export { dbConnect };
