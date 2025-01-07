import React from "react";
import { Annotorious } from "@annotorious/react";
import ImageViewer from "./OSDviewer";
//import FileUpload from "./FileUpload";
import "@annotorious/react/annotorious-react.css";
import Sidebar from "./sidebar";

interface ViewerPageProps {
  selectedImageId?: string;
  setSelectedImageId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ViewerPage: React.FC<ViewerPageProps> = ({
  selectedImageId,
  setSelectedImageId,
}) => {
  return (
    <Annotorious>
      <div className="viewer-page">
        {/* ImageViewer component */}
        <ImageViewer imageId={selectedImageId} />

        {/* Sidebar component*/}
        <Sidebar onImageSelect={setSelectedImageId} />

      </div>
    </Annotorious>
  );
};

export default ViewerPage;
