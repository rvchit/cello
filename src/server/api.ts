import express, { Request, Response } from "express";
import AWS from "aws-sdk";

const api = express.Router();

// AWS S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Pre-signed URL route
api.post("/generate-presigned-url", (req: Request, res: Response) => {
  const { fileName, fileType } = req.body;

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
  };

  s3.getSignedUrl("putObject", s3Params, (err, url) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ url }); // return pre-signed URL
  });
});

export default api;
