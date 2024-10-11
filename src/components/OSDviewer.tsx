import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import './OSDViewer.css';

interface ImageViewerProps {
  imageId: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageId }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const osdViewer = useRef<OpenSeadragon.Viewer | null>(null);

  useEffect(() => {
    if (viewerRef.current && !osdViewer.current) {
      // Initialize OpenSeadragon viewer
      osdViewer.current = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/", // replace with my own icons
        tileSources: {
          width: 2220, // set to variable which is fetched from s3 bucket
          height: 2967, // set to variable which is fetched from s3 bucket
          tileSize: 256,
          getTileUrl: function (level, x, y) {
            // Construct the URL for each tile
            return `http://localhost:5000/api/tile/${imageId}/${level}/${x}/${y}`;
          },
        },
        showNavigator: true,
        navigatorPosition: "BOTTOM_RIGHT",
        zoomInButton: "zoom-in",
        zoomOutButton: "zoom-out",
        homeButton: "home",
        fullPageButton: "full-page",
        visibilityRatio: 1.0,  // Ensures the image stays centered when zooming out
        minZoomLevel: 0.5,     // Minimum zoom level
        maxZoomLevel: 10,      // Maximum zoom level
      });
    }

    return () => {
      // Clean up the OpenSeadragon viewer
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }
    };
  }, [imageId]);

  return (
    <div className="image-viewer">
      <div id="openseadragon-viewer" ref={viewerRef} className="viewer-container"></div>
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
