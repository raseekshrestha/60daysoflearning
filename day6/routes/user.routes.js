import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post("/", (req, res) => {
    const { username, password } = req.body;
    const token = jwt.sign({ username }, "supersecretkey", { expiresIn: '1d' })
    res.json({ token })
})

router.get("/", (req, res) => {
    res.send("get request to /api/user/")
})

router.get("/groupx", (req, res) => {
    res.json([{ id: 1, name: "hau" }, { id: 2, name: "lala" }])
})


export default router;
