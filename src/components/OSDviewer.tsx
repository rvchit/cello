// OSDViewer.tsx
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import OpenSeadragon from "openseadragon";
import "./OSDViewer.css";

interface ImageViewerProps {
  imageId?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageId }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const osdViewer = useRef<OpenSeadragon.Viewer | null>(null);

  useEffect(() => {
    if (viewerRef.current && !osdViewer.current) {
      osdViewer.current = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/",
        tileSources: {
          width: 2220,
          height: 2967,
          tileSize: 256,
          getTileUrl: (level: number, x: number, y: number): string => {
            // Construct the tile URL dynamically
            return `http://localhost:3002/osd/tile/${imageId}/${level}/${x}/${y}`;
          },
        },
        showNavigator: true,
        navigatorPosition: "BOTTOM_RIGHT",
        zoomInButton: "zoom-in",
        zoomOutButton: "zoom-out",
        homeButton: "home",
        fullPageButton: "full-page",
        visibilityRatio: 1.0,
        minZoomLevel: 0.5,
        maxZoomLevel: 10,
      });
    }

    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }
    };
  }, [imageId]);

  return (
    <div className="image-viewer">
      <div
        id="openseadragon-viewer"
        ref={viewerRef}
        className="viewer-container"
      ></div>
      <div id="controls">
        <button id="zoom-in">Zoom In</button>
        <button id="zoom-out">Zoom Out</button>
        <button id="home">Reset</button>
        <button id="full-page">Full Page</button>
      </div>
    </div>
  );
};

export default ImageViewer;
