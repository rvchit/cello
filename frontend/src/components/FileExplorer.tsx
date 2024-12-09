import React, { useState } from "react";

const FileExplorer: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleExplorer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleExplorer}>
        {isOpen ? "Close Explorer" : "Open Explorer"}
      </button>
      {isOpen && (
        <div>
          {/* Render folder structure here */}
          <p>Folder 1</p>
          <p>Folder 2</p>
          {/* Add functionality to close sub-folders as needed */}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
