import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { createOSDAnnotator, ImageAnnotation, OpenSeadragonAnnotator } from "@annotorious/openseadragon";
import axios from "axios";
import "./OSDViewer.css";

interface ImageViewerProps {
  imageId?: string;
}

type ImageAnnotationWithBody = ImageAnnotation & {
  body?: Array<{ type: string; value: string }>;
};

const OSDViewer: React.FC<ImageViewerProps> = ({ imageId }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null); // Ref for OpenSeadragon container
  const osdViewer = useRef<OpenSeadragon.Viewer | null>(null); // Ref for OpenSeadragon instance
  const annotatorRef = useRef<OpenSeadragonAnnotator | null>(null); // Ref for Annotorious annotator instance
  const [popupVisible, setPopupVisible] = useState(false); // State for showing comment popup
  const [comment, setComment] = useState(""); // State for user comments
  const [currentAnnotation, setCurrentAnnotation] = useState<ImageAnnotationWithBody | null>(null); // Current annotation being created

  useEffect(() => {
    if (viewerRef.current && !osdViewer.current) {
      // Initialize OpenSeadragon Viewer
      osdViewer.current = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/",
        tileSources: {
          width: 2220,
          height: 2967,
          tileSize: 256,
          getTileUrl: (level: number, x: number, y: number): string => {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4001";
            return `${backendUrl}/osd/tile/${imageId}/${level}/${x}/${y}`;
          },
        },
        showNavigator: true,
        crossOriginPolicy: "Anonymous",
        navigatorPosition: "BOTTOM_RIGHT",
        visibilityRatio: 1.0,
        minZoomLevel: 0.5,
        maxZoomLevel: 10,
      });

      // Create Annotorious Annotator
      annotatorRef.current = createOSDAnnotator(osdViewer.current);

      // Add Event Listeners
      annotatorRef.current.on("createAnnotation", (annotation) => {
        console.log("Annotation created:", annotation);
        setCurrentAnnotation(annotation); // Save the annotation
        setPopupVisible(true); // Show the comment popup
      });
    }

    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }
      annotatorRef.current = null;
    };
  }, [imageId]);

  // Save the comment to the backend and update the annotation
  const saveComment = async () => {
    if (annotatorRef.current && currentAnnotation) {
      try {
        // Save the comment to the backend
        // CHANGE this to await a backend function in /annotationsRoute
        const response = await axios.post("/comments", {
          imageId,
          annotationId: currentAnnotation.id,
          comment,
        });

        console.log("Comment saved:", response.data);

        // Update the annotation with the comment
        const updatedAnnotation = {
          ...currentAnnotation,
          body: [
            ...(currentAnnotation?.body || []),
            { type: "TextualBody", value: comment },
          ],
        };

        annotatorRef.current.updateAnnotation(updatedAnnotation);
        console.log("Annotation updated with comment:", updatedAnnotation);

        setComment("");
        setCurrentAnnotation(null);
        setPopupVisible(false);
      } catch (error) {
        console.error("Error saving comment:", error);
      }
    }
  };

  // Cancel the comment creation
  const cancelComment = () => {
    setComment("");
    setCurrentAnnotation(null);
    setPopupVisible(false);
  };

  // Delete Selected Annotation
  const deleteSelectedAnnotation = () => {
    if (annotatorRef.current && currentAnnotation) {
      annotatorRef.current.removeAnnotation(currentAnnotation.id);
      console.log("Deleted annotation:", currentAnnotation.id);
      setCurrentAnnotation(null);
    } else {
      console.log("No annotation selected for deletion.");
    }
  };

  return (
    <div className="image-viewer-container">
      <div className="image-viewer">
        <div
          id="openseadragon-viewer"
          ref={viewerRef}
          className="viewer-container"
        ></div>
        <div id="controls">
          <button onClick={() => annotatorRef.current?.setDrawingEnabled(true)}>
            Enable Drawing
          </button>
          <button onClick={() => annotatorRef.current?.setDrawingEnabled(false)}>
            Disable Drawing
          </button>
          <button onClick={() => annotatorRef.current?.setDrawingTool("rectangle")}>
            Rectangle
          </button>
          <button onClick={() => annotatorRef.current?.setDrawingTool("polygon")}>
            Polygon
          </button>
          <button onClick={deleteSelectedAnnotation}>Delete Annotation</button>
        </div>
      </div>

      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment here..."
            ></textarea>
            <button onClick={saveComment}>Save</button>
            <button onClick={cancelComment}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OSDViewer;
