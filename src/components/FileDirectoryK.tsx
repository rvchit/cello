// src/components/FileDirectory.tsx
import React from 'react';

const FileDirectory: React.FC = () => {
  const files = ['File1.jpg', 'File2.png', 'File3.tif']; // Replace with dynamic file loading

  return (
    <div className="file-directory">
      <h3>Uploaded Files</h3>
      <ul>
        {files.map((file, index) => (
          <li key={index} style={{ cursor: 'pointer', margin: '5px 0' }}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileDirectory;
