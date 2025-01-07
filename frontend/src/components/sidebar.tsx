import React from "react";
import FileUpload from "./FileUpload";
import Comments from "./comments"; // Import the Comments component
import "./sidebar.css"; // Sidebar-specific styles

interface SidebarProps {
  onImageSelect: (imageId: string) => void; // For FileUpload
  selectedImageId?: string; // Pass the currently selected image ID
}

const Sidebar: React.FC<SidebarProps> = ({ onImageSelect, selectedImageId }) => {
  return (
    <div className="sidebar-container">
      {/* Logo Section */}
      <div className="logo-container">
        <img src="../../public/cello.png" alt="Logo" className="sidebar-logo" />
      </div>

      {/* File Upload Section */}
      <div className="sidebar-section">
        <FileUpload onImageSelect={onImageSelect} />
      </div>

      {/* Comments Section */}
      <div className="sidebar-section">
        <Comments imageId={selectedImageId} />
      </div>
    </div>
  );
};

export default Sidebar;
