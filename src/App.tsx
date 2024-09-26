import React from "react";
import FileUpload from "./components/FileUpload";
import ParentComponent from "./components/ParentViewer"; // Importing ParentComponent from ImageViewer
import NavBar from "./components/NavBar";
import FileExplorer from "./components/FileExplorer";

const App: React.FC = () => {
  return (
    <div>
      {/* Navigation Bar*/}
      <NavBar/>
      
      {/* File Upload component */}
      <FileUpload />

      {/* Image Viewer component */}
      <ParentComponent />

      {/* File Explorer*/}
      <FileExplorer />
      
      
    </div>
  );
};

export default App;
