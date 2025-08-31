import React, { useState } from 'react';
import './DocumentSearch.css';

interface DocumentSearchProps {
  onSearch: (documentChunkId: string) => void;
  isLoading: boolean;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ onSearch, isLoading }) => {
  const [documentChunkId, setDocumentChunkId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentChunkId.trim()) {
      setError('Please enter a document chunk ID');
      return;
    }
    
    setError('');
    onSearch(documentChunkId.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentChunkId(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="search-container">
      <h1 className="app-title">Document Inspector</h1>
      <p className="app-description">
        Enter a document chunk ID to view its metadata and content from the Microsoft Knowledge API.
      </p>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <label htmlFor="documentChunkId" className="input-label">
            Document Chunk ID
          </label>
          <input
            type="text"
            id="documentChunkId"
            value={documentChunkId}
            onChange={handleInputChange}
            placeholder="Enter document chunk ID (e.g., doc-12345-chunk-67890)"
            className={`search-input ${error ? 'error' : ''}`}
            disabled={isLoading}
          />
          {error && <span className="error-message">{error}</span>}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !documentChunkId.trim()}
          className="search-button"
        >
          {isLoading ? (
            <>
              <span className="button-spinner"></span>
              Loading...
            </>
          ) : (
            'Search Document'
          )}
        </button>
      </form>
    </div>
  );
};

export default DocumentSearch;
