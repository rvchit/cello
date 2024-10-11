import React, { useRef, useState } from "react";
import {
  initiateUpload,
  uploadChunk,
  completeUpload,
} from "../backend/fileuploadApi";
import "./FileUpload.css"; // Assuming you have some basic styles

const FileUpload: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger hidden file input element
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Step 1: Initiate the upload and get the uploadId
        const { uploadId } = await initiateUpload(file.name);

        const chunkSize = 5 * 1024 * 1024; // 5MB per chunk
        const totalChunks = Math.ceil(file.size / chunkSize);
        let uploadedParts: Array<{ ETag: string; PartNumber: number }> = [];
        let totalUploaded = 0;

        // Step 2: Upload each chunk
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(file.size, start + chunkSize);
          const chunk = file.slice(start, end);

          // Upload each chunk to the server (API call)
          const { ETag } = await uploadChunk(chunk, file.name, uploadId, i + 1);
          uploadedParts.push({ ETag, PartNumber: i + 1 });

          // Update upload progress
          totalUploaded += chunk.size;
          setUploadProgress((totalUploaded / file.size) * 100);
        }

        // Step 3: Complete the upload
        await completeUpload(file.name, uploadId, uploadedParts);
        console.log("File uploaded successfully");
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("File upload failed:", error);
        alert("File upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the default file input element
        onChange={handleFileChange} // Handle file selection
      />
      <button
        className="upload-btn"
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading
          ? `Uploading: ${fileName}`
          : fileName
            ? `Selected: ${fileName}`
            : "Choose File"}
      </button>
      {isUploading && (
        <p>
          Upload Progress: <strong>{uploadProgress.toFixed(2)}%</strong>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
