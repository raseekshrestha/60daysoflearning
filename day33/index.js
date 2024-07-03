import express from "express";
import dotenv from 'dotenv';
import cors from "cors";

import usersRoute from './routes/user.routes.js';
import hackathonsRoute from './routes/hackathons.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*"
}))

app.use("/api/users", usersRoute);
app.use("/api/hackathons", hackathonsRoute);

app.use((req, res, next) => {
    const error = new Error('404 not found! ' + res.originalUrl);
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500);
    res.json({
        statusCode: err.statusCode,
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV == "dev" ? err.stack : ""
    })
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
})