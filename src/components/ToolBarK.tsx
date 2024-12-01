// src/components/Toolbar.tsx
import React from 'react';

interface ToolbarProps {
  selectedTool: string | null;
  onToolSelect: (tool: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, onToolSelect }) => {
  const tools = ['Text', 'Draw', 'Shape'];

  return (
    <div className="toolbar">
      {tools.map((tool) => (
        <button
          key={tool}
          style={{
            background: selectedTool === tool ? '#ddd' : '#fff',
            padding: '10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => onToolSelect(tool)}
        >
          {tool}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
