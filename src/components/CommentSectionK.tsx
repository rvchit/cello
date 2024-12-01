// src/components/CommentSection.tsx
import React from 'react';

interface CommentSectionProps {
  annotations: any[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ annotations }) => {
  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {annotations.map((annotation, index) => (
        <div key={index}>
          {annotation.type === 'text' && <p>{annotation.text}</p>}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
