import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import "./OSDViewer.css";

interface ImageViewerProps {
  imageId?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageId }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const osdViewer = useRef<OpenSeadragon.Viewer | null>(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false); // Track if user is actively drawing
  const [annotations, setAnnotations] = useState<Array<{ x: number; y: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const minZoom = 0.5;
  const maxZoom = 40;

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
        maxZoomLevel: 40,
      });

      osdViewer.current.addHandler("zoom", () => {
        const newZoom = osdViewer.current?.viewport.getZoom() || 1;
        setCurrentZoom(newZoom);
      });

      osdViewer.current.addHandler("open", () => {
        const initialZoom = osdViewer.current?.viewport.getHomeZoom() || 1;
        setCurrentZoom(initialZoom);
      });
    }

    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }
    };
  }, [imageId]);

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(event.target.value);
    setCurrentZoom(newZoom);
    if (osdViewer.current) {
      osdViewer.current.viewport.zoomTo(newZoom);
    }
  };

  const enterAnnotationMode = () => {
    setIsAnnotationMode(true);
  };

  const saveAnnotation = () => {
    setIsAnnotationMode(false);
    setIsDrawing(false);
    if (osdViewer.current) {
      osdViewer.current.setMouseNavEnabled(true); // Re-enable zoom and pan
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAnnotationMode || !canvasRef.current) return;

    if (osdViewer.current && !isDrawing) {
      osdViewer.current.setMouseNavEnabled(false); // Disable zoom and pan when starting to draw
      setIsDrawing(true);
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setAnnotations((prev) => [...prev, { x, y }]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "red";
      context.lineWidth = 2;

      annotations.forEach(({ x, y }, index) => {
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.stroke();
    }
  }, [annotations]);

  return (
    <div className="image-viewer">
      <div id="openseadragon-viewer" ref={viewerRef} className="viewer-container"></div>

      {/* Canvas overlay for annotation */}
      <canvas
        ref={canvasRef}
        className="annotation-canvas"
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: isAnnotationMode ? "auto" : "none",
          width: "100%",
          height: "100%",
        }}
      ></canvas>

      <div id="controls">
        <button id="zoom-in">Zoom In</button>
        <button id="zoom-out">Zoom Out</button>
        <button id="home">Reset</button>
        <button id="full-page">Full Page</button>
        <button onClick={enterAnnotationMode}>Enter Annotation Mode</button>
        {isAnnotationMode && (
          <button onClick={saveAnnotation}>Save Annotation</button>
        )}
      </div>

      <div className="zoom-bar">
        <input
          type="range"
          min={minZoom}
          max={maxZoom}
          step="0.1"
          value={currentZoom}
          onChange={handleZoomChange}
          className="zoom-slider"
        />
        <span className="zoom-level-display">{currentZoom.toFixed(1)}x</span>
      </div>
    </div>
  );
};

export default ImageViewer;
