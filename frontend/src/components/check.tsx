import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./FileUpload";
import { Annotorious } from "@annotorious/react";
import ImageViewer from "./OSDviewer";
import "@annotorious/react/annotorious-react.css";

const App: React.FC = () => {
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>();

  return (
    <Router>
      <div className="APP">
        <Annotorious>
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
        </Annotorious>
      </div>
    </Router>
  );
};

export default App;
