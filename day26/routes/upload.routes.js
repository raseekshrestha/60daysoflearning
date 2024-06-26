import { Router } from "express";
import multer from "multer";
import { handleFileUpload } from "../controllers/upload.controllers.js";

const upload = multer({
    dest: "uploads/",
})


const router = Router();


router.post("/", upload.single("file"), handleFileUpload);


export default router;