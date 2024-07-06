
import { configDotenv } from 'dotenv';
configDotenv()

import path from 'path';
import { fileURLToPath } from 'url'
import express from 'express';
import {
    getObjectUrl,
    putObject,
    deleteObject,
    listObjects
} from './utils/awsutils.js'
import { ApiResponse } from './utils/ApiResponse.js'
import { ApiError } from './utils/ApiError.js'




const app = express();
app.use(express.json())

app.get("/", (req, res) => {
    const dirname = path.resolve()
    res.sendFile(path.join(dirname, "index.html"))
})

app.post("/api/upload", async (req, res) => {
    const { filename, filetype } = req.body;
    const ext = path.extname(filename);
    const newFilename = path.basename(filename, ext) + "-" + Date.now() + ext
    try {
        const signedUrl = await putObject("useruploads/" + newFilename, filetype)
        res.json(new ApiResponse(200, "PUT url", signedUrl))

    } catch (err) {
        // res.status(500).json()
        throw new ApiError(err.message || "failed to obtain signed url")
    }

})

app.get("/api/listobject", async (req, res) => {
    res.json((await listObjects()).Contents)
})

app.delete("/api/delobject/", async (req, res) => {
    const objKey = req.query.objKey
    const resp = await deleteObject(objKey)
    return res.status(204).send()
})




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("server running on port :", PORT)
})
