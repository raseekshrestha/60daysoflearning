import express from 'express';
import { dbConnect } from '../config/dbConfig.js';
import { userModel } from './models/user.models.js';

dbConnect();

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (user) {
        return res.status(400).json({ message: "user already exists" });
    }
    const newUser = await userModel.create({ username, password });
    res.status(201).json({ message: "user registered successfully" });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username, password });
    if (user) {
        return res.json({ message: "login success" });
    } else {
        return res.status(401).json({ message: "login failed" });
    }
});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});

export default app;
