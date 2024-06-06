import express from "express";
import cors from 'cors';
import userRoutes from './routes/user.routes.js';

const app = express();
app.use(cors({
    origin: "*"
}))

app.use(express.json());

app.use("/api/users", userRoutes);




app.listen(8000, () => {
    console.log("server running on port 8000");
})