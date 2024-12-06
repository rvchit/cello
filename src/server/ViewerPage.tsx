import React from "react";
import { Annotorious } from "@annotorious/react";
import ImageViewer from "../components/OSDviewer";
import FileUpload from "../components/FileUpload";
import "@annotorious/react/annotorious-react.css";

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
        <ImageViewer imageId={selectedImageId} />
        <FileUpload onImageSelect={setSelectedImageId} />
      </div>
    </Annotorious>
  );
};

export default ViewerPage;
