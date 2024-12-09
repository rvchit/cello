import React, { useRef, useState } from "react";
import {
  initiateUpload,
  uploadChunk,
  completeUpload,
} from "../api/fileuploadApi";
import "./FileUpload.css"; // Assuming you have some basic styles


interface FileUploadProps {
  onImageSelect: (imageId: string) => void; // Define the prop type
}

const FileUpload: React.FC<FileUploadProps> = ({onImageSelect}) => {
  // Initialize with the default file "CMU-1-Small-Region"
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "CMU-1-Small-Region",
  ]); // Preloaded default file
  const [selectedFile, setSelectedFile] = useState<string | null>(null); // State for selected file
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

      try {
        // Step 1: Initiate the upload and get the uploadId
        const { uploadId } = await initiateUpload(file.name);

        const chunkSize = 5 * 1024 * 1024; // 5MB per chunk
        const totalChunks = Math.ceil(file.size / chunkSize);
        let uploadedParts: Array<{ ETag: string; PartNumber: number }> = [];

        // Step 2: Upload each chunk
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(file.size, start + chunkSize);
          const chunk = file.slice(start, end);

          // Upload each chunk to the server (API call)
          const { ETag } = await uploadChunk(chunk, file.name, uploadId, i + 1);
          uploadedParts.push({ ETag, PartNumber: i + 1 });
        }

        // Step 3: Complete the upload
        await completeUpload(file.name, uploadId, uploadedParts);
        console.log("File uploaded successfully");

        // Add the uploaded file to the list of uploaded files
        setUploadedFiles(prevFiles => [...prevFiles, file.name]);

        alert("File uploaded successfully!");
      } catch (error) {
        console.error("File upload failed:", error);
        alert("File upload failed. Please try again.");
      } finally {
        setIsUploading(false); // Stop the spinner once the upload is complete
      }
    }
  };

  const handleFileClick = (file: string) => {
    setSelectedFile(file); // Set the selected file when clicked
  };
  const handleViewClick = () => {
    if (selectedFile) {
      onImageSelect(selectedFile); // Pass the selected file name
    }
  }
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
        {isUploading ? "Uploading..." : fileName ? `- ${fileName}` : "Choose File"}

        {/* Show spinner when uploading */}
        {isUploading && <div className="spinner"></div>}
      </button>

      {/* Display list of uploaded files as buttons */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Files</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                <button
                  className={`file-item-btn ${selectedFile === file ? 'selected' : ''}`}
                  onClick={() => handleFileClick(file)}
                >
                  {file}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* View button */}
      {selectedFile && (
        <button className="view-btn" onClick={handleViewClick}>
          View {selectedFile}
        </button>
      )}
    </div>
  );
};

export default FileUpload;
