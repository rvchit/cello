import React from "react";
import FileUpload from "./components/FileUpload";
import ParentComponent from "./components/ParentViewer"; // Importing ParentComponent from ImageViewer

const App: React.FC = () => {
  return (
    <div>
      <h1>Cello</h1>
      
      {/* File Upload component */}
      <FileUpload />

      {/* Image Viewer component */}
      <ParentComponent />
    </div>
  );
};

export default App;
