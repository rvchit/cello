import AWS from 'aws-sdk';
import { Request, Response } from 'express';

// Set up AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
    useAccelerateEndpoint: true,
});

const bucketName = process.env.AWS_BUCKET_NAME;

// Initiate multipart upload
export const initiateMultipartUpload = async (req: Request, res: Response) => {
    try {        
        if (!bucketName) {
            return res.status(500).json({ success: false, message: 'Bucket name is not defined' });
        }
        const { fileName } = req.body;
        const params = {
            Bucket: bucketName,
            Key: fileName,
        };
    
        const upload = await s3.createMultipartUpload(params).promise();

        // Return the upload ID to the client
        return res.json({ uploadId: upload.UploadId });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error initializing upload' });
    }
    };


// Upload chunk of the file to S3
export const uploadPart = (req: Request, res: Response) => {
    try {
      const { index, fileName } = req.body;  // Extract the chunk index and file name from the request body
      const file = req.file;  // Get the file chunk from Multer
      // Check if the file exists
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,  // Use the bucket name from environment variables
            Key: fileName,  // Set the file name for the S3 object
            Body: file.buffer,  // File chunk to be uploaded
            PartNumber: Number(index) + 1,  // Increment the part number for each chunk
            UploadId: req.query.uploadId as string,  // Multipart upload ID
        };
      // Upload the part to S3
        s3.uploadPart(s3Params, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Error uploading chunk' });
            }
        // On success, return a response with the part's ETag (used to complete the multipart upload)
        return res.json({ success: true, message: 'Chunk uploaded successfully', ETag: data.ETag });
    });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error while uploading chunk' });
    }
};

// Complete the multipart upload by combining all uploaded parts
export const completeMultipartUpload = (req: Request, res: Response) => {
    try {
        const { fileName } = req.query;  // Extract the file name from the query parameters
        const bucketName = process.env.AWS_BUCKET_NAME;
        // Ensure the bucket name is defined
        if (!bucketName) {
            return res.status(500).json({ success: false, message: 'Bucket name is not defined' });
        }
        const s3Params = {
            Bucket: bucketName,  // S3 bucket name
            Key: fileName as string,  // The file name (S3 object key)
            UploadId: req.query.uploadId as string,  // Multipart upload ID
            };

        // List the uploaded parts
        s3.listParts(s3Params, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Error listing parts' });
            }

        // Map the parts to the required format for completing the upload
        const parts = data.Parts?.map(part => ({
            ETag: part.ETag,  // The part's ETag
            PartNumber: part.PartNumber,  // The part's number
        }));

        // Complete the multipart upload by sending all parts' info
        s3.completeMultipartUpload(
            {
            ...s3Params,
            MultipartUpload: { Parts: parts },
        },
            (err, data) => {
                if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Error completing upload' });
            }
            // On success, return the location of the uploaded file
            return res.json({ success: true, message: 'Upload complete', location: data.Location });
        });
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error while completing upload' });
    }
};