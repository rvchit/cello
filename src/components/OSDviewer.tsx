import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import './ImageViewer.css';

interface ImageViewerProps {
  imageId: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageId }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewerRef.current) {
      const viewer = OpenSeadragon({
        id: viewerRef.current.id,
        prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/",
        tileSources: {
          width: 2220 ,  // Replace with your image width
          height: 2967, // Replace with your image height
          tileSize: 256,
          getTileUrl: async function (level, x, y) {
            const response = await fetch(`http://localhost:5000/api/tile/${imageId}/${level}/${x}/${y}`);
            const data = await response.json();
            return data.tileUrl; // URL for the tile
          }
        },
        showNavigator: true,
        navigatorPosition: "BOTTOM_RIGHT",
        zoomInButton: "zoom-in",
        zoomOutButton: "zoom-out",
        homeButton: "home",
        fullPageButton: "full-page"
      });

      return () => {
        if (viewer) {
          viewer.destroy();
        }
      };
    }
  }, [imageId]);

  return (
    <div className="image-viewer">
      <div id="openseadragon-viewer" ref={viewerRef} style={{ width: '100%', height: '600px' }}></div>
      <div id="controls">
        <button id="zoom-in">Zoom In</button>
        <button id="zoom-out">Zoom Out</button>
        <button id="home">Home</button>
        <button id="full-page">Full Page</button>
      </div>
    </div>
  );
};

export default ImageViewer;
