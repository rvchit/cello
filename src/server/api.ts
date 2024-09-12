import express from "express";
import multer from "multer";
import { initiateMultipartUpload, uploadPart, completeMultipartUpload} from "./multipartUpload";

const router = express.Router();
const upload = multer();

router.post("/initiateUpload", initiateMultipartUpload);
router.post("/upload", upload.single("file"), uploadPart);
router.post("/completeUpload", completeMultipartUpload);

export default router;
