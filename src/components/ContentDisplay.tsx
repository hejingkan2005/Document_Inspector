import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ContentDisplay.css';

interface ContentDisplayProps {
  content: string | null | undefined;
  isLoading?: boolean;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="content-container">
        <h2 className="content-title">Document Content</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content || content.trim() === '') {
    return (
      <div className="content-container">
        <h2 className="content-title">Document Content</h2>
        <div className="no-content">
          <p>No content available for this document chunk.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <h2 className="content-title">Document Content</h2>
      <div className="markdown-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ContentDisplay;
