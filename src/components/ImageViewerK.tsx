// src/components/ImageViewer.tsx
import React, { useState } from 'react';

interface ImageViewerProps {
  selectedTool: string | null;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ selectedTool }) => {
  const [annotations, setAnnotations] = useState([]);

  const handleMouseClick = (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    if (selectedTool === 'Text') {
      const text = prompt('Enter annotation text:');
      if (text) setAnnotations([...annotations, { type: 'text', x, y, text }]);
    } else if (selectedTool === 'Draw') {
      // Draw tool logic placeholder
    } else if (selectedTool === 'Shape') {
      // Shape tool logic placeholder
    }
  };

  return (
    <div
      className="image-viewer"
      onClick={handleMouseClick}
    >
      {/* Render image and annotations */}
      {annotations.map((annotation, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: annotation.y,
            left: annotation.x,
            color: 'red',
            fontSize: '12px',
          }}
        >
          {annotation.type === 'text' ? annotation.text : null}
        </div>
      ))}
    </div>
  );
};

export default ImageViewer;
