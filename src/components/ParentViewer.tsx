import React from 'react';
import ImageViewer from './ImageViewer';



const ParentComponent: React.FC = () => {
    const imageUrl = 'https://example.com/path-to-image.jpg'; // Replace with the URL from S3 or your backend
  
    return (
      <div>
        <h1>Image Viewer</h1>
        <ImageViewer imageUrl={imageUrl} />
      </div>
    );
  };
  
  export default ParentComponent;