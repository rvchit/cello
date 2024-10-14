import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import ImageViewer from "./components/OSDviewer";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>();

  return (
    <Router>
      <div className="APP">
        {/* <NavBar /> */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ImageViewer imageId={selectedImageId} />
                <FileUpload onImageSelect={setSelectedImageId} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
