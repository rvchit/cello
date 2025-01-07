import { Router, Request, Response } from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

const router = Router();

// Ensure environment variables are set
if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.S3_TILES_BUCKET) {
  throw new Error("Missing required environment variables for AWS configuration.");
}

// Configure AWS SDK v3 S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Route to serve tiles directly from S3
router.get("/tile/:imageId/:level/:x/:y", async (req: Request, res: Response) => {
  const { imageId, level, x, y } = req.params;
  const tileKey = `${imageId}/${level}/${x}_${y}.jpeg`; // Tile path in the S3 bucket

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_TILES_BUCKET,
      Key: tileKey,
    });

    // Send the GetObjectCommand to S3
    const tileResponse = await s3Client.send(command);

    if (tileResponse.Body instanceof Readable) {
      res.setHeader("Content-Type", "image/jpeg"); // Set appropriate content type
      tileResponse.Body.pipe(res); // Stream the image directly to the response
    } else {
      res.status(404).send("Tile not found");
    }
  } catch (error) {
    console.error("Error fetching tile from S3:", (error as Error).message);
    res.status(500).send("Failed to fetch tile");
  }
});

export default router;
