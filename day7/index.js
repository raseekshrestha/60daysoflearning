import express from "express";
import cors from 'cors';
import { dbConnnect } from './config/dbConfig.js';
import userRoutes from './routes/users.routes.js';
import dotenv from 'dotenv';

dotenv.config();

dbConnnect();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
    const error = new Error(`404 not found: ${req.originalUrl}`)
    error.statusCode = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500)
    res.json({
        message: err.message || "something went wrong",
        data: err.data || null,
        stack: (process.env.NODE_ENV == 'dev') ? err.stack : ""
    })
})

app.get("/", (req, res) => {
    res.send('ok');
})






const PORT = 8000;
app.listen(PORT, () => [
    console.log(`server running on port ${PORT}`)
])