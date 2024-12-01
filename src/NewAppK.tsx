// src/App.tsx
import React, { useState } from 'react';
import Toolbar from './components/ToolBarK';
import ImageViewer from './components/ImageViewerK';
import CommentSection from './components/CommentSectionK';
import FileDirectory from './components/FileDirectoryK';

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Handle tool selection
  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar selectedTool={selectedTool} onToolSelect={handleToolSelect} />
      <div style={{ display: 'flex', flex: 1 }}>
        <ImageViewer selectedTool={selectedTool} />
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9' }}>
          <FileDirectory />
          <CommentSection />
        </div>
      </div>
    </div>
  );
};

export default App;
