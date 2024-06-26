import asyncHandler from "express-async-handler";
import fs from 'fs';

const handleFileUpload = asyncHandler(async (req, res) => {
    const originalName = req.file.originalname;
    fs.rename("uploads/" + req.file.filename, "uploads/" + Date.now() + req.file.originalname, (err) => {
        if (err) {
            console.log(err)
            return res.send("error while renameing")
        } else {
            return res.send("file uploaded successfully")
        }
    })
    // res.send(originalName + req.file.filename)
})

export { handleFileUpload };