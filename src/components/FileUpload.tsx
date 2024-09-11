import React, { useRef, useState } from "react";
import "./FileUpload.css"; // For styling

const FileUpload: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null); // State to display selected file name
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to handle the custom button click and trigger the hidden file input
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger hidden file input element
    }
  };

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name); // Set selected file name
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

      {/* Custom button to trigger file input */}
      <button className="upload-btn" onClick={handleButtonClick}>
        {fileName ? `Selected: ${fileName}` : "Choose File"}
      </button>
    </div>
  );
};

export default FileUpload;
