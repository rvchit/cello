import { Router, Request, Response } from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Configure AWS SDK v3 S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

// Route to serve pre-signed URLs for tile images
router.get("/tile/:imageId/:level/:x/:y", async (req: Request, res: Response) => {
    const { imageId, level, x, y } = req.params;
    const tileKey = `${imageId}/${level}//${x}_${y}.jpg`; // Tile path in the S3 bucket
    //check if imageID is the name of the image

    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_TILES_BUCKET,
        Key: tileKey,
      });

      // Generate a pre-signed URL for the tile
      const tileUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      res.send(tileUrl);

    } catch (error : any) {
        console.error("Error fetching tile from S3:", error.message);
      }
  },
);

export default router;
