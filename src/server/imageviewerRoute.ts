import { Router, Request, Response } from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import axios from "axios";
import path from "path";
import fs from "fs";
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

// Route to get the image URL from S3
router.get("/image/:id/url", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const params = {
      Bucket: process.env.S3_BUCKET as string,
      Key: `${id}`, // Assuming the image is stored in the S3 bucket
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour

    res.json({
      message: "Image URL fetched successfully",
      imageUrl: url,
    });
  } catch (error) {
    console.error("Error fetching image URL from S3:", error);
    res.status(500).json({ message: "Failed to fetch image URL" });
  }
});

// Route to handle dynamic tile loading for both SVS and standard images
router.get("/tile/:imageId/:level/:x/:y", async (req: Request, res: Response) => {
  const { imageId, level, x, y } = req.params;
  const fileType = path.extname(imageId).toLowerCase(); // Get file extension

  try {
    if (fileType === ".svs") {
      // Forward the request to the Python microservice for SVS file processing
      const tileResponse = await axios.get("http://127.0.0.1:5000/tile", {
        params: {
          image_id: imageId,
          level: level,
          x: x,
          y: y,
        },
        responseType: "arraybuffer",
      });

      // Return the tile from the Python service
      res.set("Content-Type", "image/jpeg");
      res.send(tileResponse.data);
    } else {
      // Handle non-SVS images directly using Sharp
      const imagePath = `/path/to/images/${imageId}`;
      const tileSize = 256;
      const xPos = parseInt(x, 10) * tileSize;
      const yPos = parseInt(y, 10) * tileSize;

      const tile = await sharp(imagePath)
        .extract({ left: xPos, top: yPos, width: tileSize, height: tileSize })
        .toFormat("jpeg")
        .toBuffer();

      res.set("Content-Type", "image/jpeg");
      res.send(tile);
    }
  } catch (error) {
    console.error("Error fetching tile:", error);
    res.status(500).json({ message: "Failed to fetch tile" });
  }
});

export default router;
