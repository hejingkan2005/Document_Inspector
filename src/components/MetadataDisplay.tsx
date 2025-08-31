import React from 'react';
import './MetadataDisplay.css';

interface DocumentMetadata {
  id: string;
  title?: string;
  lastUpdated?: string;
  depotName?: string;
  pageType?: string;
  url?: string;
}

interface MetadataDisplayProps {
  metadata: DocumentMetadata | null | undefined;
}

const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ metadata }) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Handle case where metadata is undefined or null
  if (!metadata) {
    return (
      <div className="metadata-container">
        <h2 className="metadata-title">Document Metadata</h2>
        <div className="metadata-error">
          <p>⚠️ No metadata available for this document chunk.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="metadata-container">
      <h2 className="metadata-title">Document Metadata</h2>
      <div className="metadata-grid">
        <div className="metadata-item">
          <label className="metadata-label">Document ID:</label>
          <span className="metadata-value">{metadata.id || 'N/A'}</span>
        </div>
        
        <div className="metadata-item">
          <label className="metadata-label">Title:</label>
          <span className="metadata-value">{metadata.title || 'N/A'}</span>
        </div>
        
        <div className="metadata-item">
          <label className="metadata-label">URL:</label>
          <span className="metadata-value">
            {metadata.url ? (
              <a href={metadata.url} target="_blank" rel="noopener noreferrer">
                {metadata.url}
              </a>
            ) : (
              'N/A'
            )}
          </span>
        </div>
        
        <div className="metadata-item">
          <label className="metadata-label">Depot Name:</label>
          <span className="metadata-value">{metadata.depotName || 'N/A'}</span>
        </div>
        
        <div className="metadata-item">
          <label className="metadata-label">Last Updated:</label>
          <span className="metadata-value">{formatDate(metadata.lastUpdated)}</span>
        </div>
        
        <div className="metadata-item">
          <label className="metadata-label">Page Type:</label>
          <span className="metadata-value">{metadata.pageType || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default MetadataDisplay;
