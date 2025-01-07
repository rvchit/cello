import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Comments.css"; // Add styles for comments if needed

interface CommentsProps {
  imageId?: string; // The ID of the currently selected image
}

const Comments: React.FC<CommentsProps> = ({ imageId }) => {
  const [comments, setComments] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (imageId) {
      // Fetch comments when imageId changes
      // FETCH COMMENTS FROM DB 
      const fetchComments = async () => {
        try {
          const response = await axios.get(`/comments/${imageId}`); // Backend endpoint to fetch comments
          setComments(response.data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };

      fetchComments();
    }
  }, [imageId]);

  return (
    <div className="comments-container">
      <h4>Comments</h4>
      {comments.length === 0 ? (
        <p>No comments yet for this image.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
