import express from "express";
import cors from 'cors';
import { dbConnnect } from './config/dbConfig.js';
import blogRoutes from './routes/blog.routes.js';
import userRoutes from './routes/user.routes.js';
import commentRoutes from './routes/comment.routes.js';
import { configDotenv } from "dotenv";

configDotenv();
dbConnnect();

const app = express();
app.use(express.json());
app.use(cors());



app.use("/blogs", blogRoutes);
app.use("/users", userRoutes);
app.use("/comments", commentRoutes);

app.get("/", (req, res) => {
    res.send('ok');
})


app.use((req, res, next) => {
    const error = new Error(`404 not found: ${req.originalUrl}`)
    error.status = 404;
    next(error)
})

app.use((err, req, res, next) => {
    res.status(res.statusCode || 500);
    console.log(err)
    res.json({
        error: {
            message: err.message,
            stack: process.env.NODE_ENV == "production" ? null : err.stack
        }
    })
})



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => [
    console.log(`server running on port ${PORT}`)
])


export default app;