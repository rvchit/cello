import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { createOSDAnnotator, OpenSeadragonAnnotator } from "@annotorious/openseadragon";
import "./OSDViewer.css";

interface ImageViewerProps {
  imageId?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageId }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null); // Ref for OpenSeadragon container
  const osdViewer = useRef<OpenSeadragon.Viewer | null>(null); // Ref for OpenSeadragon instance
  const annotatorRef = useRef<OpenSeadragonAnnotator | null>(null); // Ref for Annotorious annotator instance
  const [selectedAnnotation, setSelectedAnnotation] = useState<any | null>(null); // State for selected annotation
  const [activeButton, setActiveButton] = useState<string | null>(null); // State for active button
  const [popupVisible, setPopupVisible] = useState(false); // State for showing comment popup
  const [comment, setComment] = useState(""); // State for user comments
  const [currentAnnotation, setCurrentAnnotation] = useState<any | null>(null); // Current annotation being created
  const [comments, setComments] = useState<{ id: string; text: string }[]>([]); // List of saved comments

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
      annotatorRef.current = createOSDAnnotator(osdViewer.current, {
        theme: "light", // Options: 'light', 'dark', or 'auto'
      });

      // Add Event Listeners
      annotatorRef.current.on("createAnnotation", (annotation) => {
        console.log("Annotation created:", annotation);
        setCurrentAnnotation(annotation); // Save the annotation
        setPopupVisible(true); // Show the comment popup
      });

      annotatorRef.current.on("updateAnnotation", (annotation, previous) => {
        console.log("Annotation updated:", annotation, previous);
      });

      annotatorRef.current.on("deleteAnnotation", (annotation) => {
        console.log("Annotation deleted:", annotation);
        if (selectedAnnotation?.id === annotation.id) {
          setSelectedAnnotation(null); // Clear selected annotation if deleted
        }
        setComments((prevComments) => prevComments.filter((c) => c.id !== annotation.id)); // Remove comment
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

   // Save the comment to the annotation and list
   const saveComment = () => {
    if (annotatorRef.current && currentAnnotation) {
      const updatedAnnotation = {
        ...currentAnnotation,
        body: [
          ...(currentAnnotation.body || []),
          {
            type: "TextualBody",
            value: comment,
          },
        ],
      };

      annotatorRef.current.updateAnnotation(updatedAnnotation);
      console.log("Annotation updated with comment:", updatedAnnotation);

      // Add comment to the list
      setComments((prevComments) => [
        ...prevComments,
        { id: updatedAnnotation.id, text: comment },
      ]);

      setComment("");
      setCurrentAnnotation(null);
      setPopupVisible(false);
    }
  };

  // Cancel the comment
  const cancelComment = () => {
    setComment("");
    setCurrentAnnotation(null);
    setPopupVisible(false);
  };

  // Delete Selected Annotation
  const deleteSelectedAnnotation = () => {
    if (annotatorRef.current && selectedAnnotation) {
      annotatorRef.current.removeAnnotation(selectedAnnotation.id);
      console.log("Deleted annotation:", selectedAnnotation.id);
      setSelectedAnnotation(null);
      setActiveButton(null); // Clear active button on deletion
    } else {
      console.log("No annotation selected for deletion.");
    }
  };

  // Toggle Drawing Mode
  const toggleDrawingTool = () => {
    if (annotatorRef.current) {
      const isEnabled = annotatorRef.current.isDrawingEnabled();
      annotatorRef.current.setDrawingEnabled(!isEnabled);
      setActiveButton(isEnabled ? null : "drawing");
      console.log(`Drawing Tool ${!isEnabled ? "Enabled" : "Disabled"}`);
    }
  };

  // Set Rectangle Tool
  const setRectangleTool = () => {
    if (annotatorRef.current) {
      annotatorRef.current.setDrawingTool("rectangle");
      setActiveButton("rectangle");
      console.log("Rectangle drawing tool set.");
    }
  };

  // Set Polygon Tool
  const setPolygonTool = () => {
    if (annotatorRef.current) {
      annotatorRef.current.setDrawingTool("polygon");
      setActiveButton("polygon");
      console.log("Polygon drawing tool set.");
    }
  };

  // Select an Annotation
  const selectAnnotation = () => {
    if (annotatorRef.current) {
      const selected = annotatorRef.current.getSelected();
      if (selected.length > 0) {
        console.log("Selected annotation:", selected[0]);
        setSelectedAnnotation(selected[0]);
        setActiveButton("select"); // Set "Select" button as active
      } else {
        console.log("No annotation selected.");
        setSelectedAnnotation(null);
        setActiveButton(null); // Clear active button if no selection
      }
    }
  };

  
  return (
    <div className="image-viewer-container">
      <div className="comments-sidebar">
        <h5>Comments</h5>
        {comments.length === 0 ? (
          <p></p>
        ) : (
          <ul>
            {comments.map((c) => (
              <li key={c.id}>{c.text}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="image-viewer">
        <div
          id="openseadragon-viewer"
          ref={viewerRef}
          className="viewer-container"
        ></div>
        <div id="controls">
          <button
            className={activeButton === "drawing" ? "active" : ""}
            onClick={toggleDrawingTool}
          >
            Drawing Tool
          </button>
          <button
            className={activeButton === "rectangle" ? "active" : ""}
            onClick={setRectangleTool}
          >
            Rectangle
          </button>
          <button
            className={activeButton === "polygon" ? "active" : ""}
            onClick={setPolygonTool}
          >
            Polygon
          </button>
          <button
            className={activeButton === "select" ? "active" : ""}
            onClick={selectAnnotation}
          >
            Select
          </button>
          <button onClick={deleteSelectedAnnotation}>Delete</button>
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

export default ImageViewer;