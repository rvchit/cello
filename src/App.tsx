import React from "react";
import FileUpload from "./components/FileUpload";
import ParentComponent from "./components/ParentViewer"; // Importing ParentComponent from ImageViewer
import NavBar from "./components/NavBar";
import ImageViewer from './components/OSDviewer';


const App: React.FC = () => {
  const imageID = "CMU-1-Small-Region"
  return (
    <div className = "APP">
      {/*Image Viewer with OpenSeadragon */}
      <ImageViewer imageId={imageID} />
      {/* Navigation Bar*/}
      <NavBar/>
      
      {/* File Upload component */}
      <FileUpload />

      {/* Image Viewer component */}
      <ParentComponent />

      {/* File Explorer
      <FileExplorer /> */}
      
    </div>
  );
};

export default App;
