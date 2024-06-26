import express from "express";
import uploadRoute from './routes/upload.routes.js';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/upload", uploadRoute)

app.get("/", (req, res) => {

    res.send(__dirname)
})

app.listen(8000, () => {
    console.log("server running on port 8000")
})