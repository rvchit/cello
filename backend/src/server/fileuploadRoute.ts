import express, { Request, Response } from "express";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import multer from "multer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express router
const router = express.Router();

// Initialize the S3 client (AWS SDK v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

// Use multer for handling multipart form data (file uploads)
const multerUpload = multer({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB size limit for the file chunk (adjust as needed)
});

// Route to start multipart upload
router.post("/start-upload", async (req: Request, res: Response) => {
  const { fileName, fileType }: { fileName: string; fileType: string } =
    req.body;

  const params = {
    Bucket: process.env.S3_BUCKET!,
    Key: fileName,
    ContentType: fileType,
  };

  try {
    // Create a new multipart upload using AWS SDK v3 command
    const command = new CreateMultipartUploadCommand(params);
    const upload = await s3.send(command);
    console.log({ upload });
    res.send({ uploadId: upload.UploadId });
  } catch (error) {
    console.error("Error starting upload", error);
    res.status(500).send(error);
  }
});

// Route to upload a chunk (part) of the file
router.post(
  "/upload-part",
  multerUpload.single("fileChunk"),
  async (req: Request, res: Response) => {
    console.log("File received:", req.file); // This should log the uploaded file
    if (!req.file) {
      return res.status(400).send({ message: "Missing file chunk" });
    }

    const {
      fileName,
      partNumber,
      uploadId,
    }: { fileName: string; partNumber: number; uploadId: string } = req.body;
    const fileChunk = req.file.buffer;

    console.log({ fileName, partNumber, uploadId, fileChunk });
    const params = {
      Bucket: process.env.S3_BUCKET!,
      Key: fileName,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: fileChunk,
    };

    try {
      // Upload the part using AWS SDK v3 command
      const command = new UploadPartCommand(params);
      const uploadParts = await s3.send(command);
      console.log({ uploadParts });
      res.send({ ETag: uploadParts.ETag });
    } catch (error) {
      console.error("Error uploading part", error);
      res.status(500).send(error);
    }
  },
);

// Route to complete multipart upload
router.post("/complete-upload", async (req: Request, res: Response) => {
  const {
    fileName,
    uploadId,
    parts,
  }: {
    fileName: string;
    uploadId: string;
    parts: Array<{ ETag: string; PartNumber: number }>;
  } = req.body;

  const params = {
    Bucket: process.env.S3_BUCKET!,
    Key: fileName,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };

  try {
    // Complete the multipart upload using AWS SDK v3 command
    const command = new CompleteMultipartUploadCommand(params);
    const complete = await s3.send(command);
    console.log({ complete });
    res.send({ fileUrl: complete.Location });
  } catch (error) {
    console.error("Error completing upload", error);
    res.status(500).send(error);
  }
});

// Export the router to be used in index.ts
export default router;
