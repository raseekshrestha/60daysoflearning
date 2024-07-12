import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import encryptModel from './models/encrypt.model.js';
import dbConnect from './config/dbConfig.js';





dbConnect();


const app = express();
app.use(express.json({ limit: '10mb' }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/img.html");
})

app.post("/add", async (req, res) => {
    const { encryptedHex, name } = req.body;
    // console.log(encryptedHex, name)
    const enc = await encryptModel.create({ encryptedHex, name })
    res.json({ message: "uplaod done", name: enc.name })
})

app.get("/getnames", async (req, res) => {
    const names = await encryptModel.find({}, { name: 1 });
    res.json(names)
})

app.get("/getimage", async (req, res) => {
    const _id = req.query._id;
    const encryptedHex = await encryptModel.findOne({ _id })
    res.json(encryptedHex)
})


app.listen(8000);