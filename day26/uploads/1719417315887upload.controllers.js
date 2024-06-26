import asyncHandler from "express-async-handler";
import fs from 'fs';

const handleFileUpload = asyncHandler(async (req, res) => {
    const originalName = req.file.originalname;
    const newfile = "./uploads/" + Date.now() + req.file.originalname
    fs.rename("uploads/" + req.file.filename, newfile, (err) => {
        if (err) {
            console.log(err)
            return res.send("error while renameing")
        } else {
            return res.json({
                message: "upload success",
                filePath: newfile
            })
        }
    })
})

export { handleFileUpload };