
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { config, configDotenv } from 'dotenv';

import userRoutes from './routes/user.routes.js';


configDotenv()



const app = express();
app.use(cors());
app.use(express.json());



connectDB()

app.get("/", (req, res) => {
    res.send("welsome my world chat app")
})

app.use("/api/user", userRoutes)


// error handlers
app.use(notFound)
app.use(errorHandler)


app.listen(8000, () => {
    console.log("server running on port 8000")
})

