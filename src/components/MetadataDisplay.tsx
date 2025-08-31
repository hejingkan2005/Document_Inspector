import React from 'react';
import './MetadataDisplay.css';

interface DocumentMetadata {
  'document-chunk-id': string;
  url?: string;
  title?: string;
  'depot-name'?: string;
  'last-updated-at'?: string;
  'page-type'?: string;
}

interface MetadataDisplayProps {
  metadata: DocumentMetadata;
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

  return (
    <div className="metadata-container">
      <h2 className="metadata-title">Document Metadata</h2>
      <div className="metadata-grid">
        <div className="metadata-item">
          <label className="metadata-label">Document Chunk ID:</label>
          <span className="metadata-value">{metadata['document-chunk-id']}</span>
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
          <label className="metadata-label">Title:</label>
          <span className="metadata-value">{metadata.title || 'N/A'}</span>
        </div>
        
        <div className="metadata-item">
          <label className="metadata-label">Depot Name:</label>
          <span className="metadata-value">{metadata['depot-name'] || 'N/A'}</span>
        </div>
        
        <div className="metadata-item">
          <label className="metadata-label">Last Updated:</label>
          <span className="metadata-value">{formatDate(metadata['last-updated-at'])}</span>
        </div>
        
        <div className="metadata-item">
          <label className="metadata-label">Page Type:</label>
          <span className="metadata-value">{metadata['page-type'] || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default MetadataDisplay;
