// Types for the Knowledge API response
export interface DocumentMetadata {
  'document-chunk-id': string;
  url?: string;
  title?: string;
  'depot-name'?: string;
  'last-updated-at'?: string;
  'page-type'?: string;
}

export interface DocumentChunk {
  metadata: DocumentMetadata;
  content: string;
}

export interface KnowledgeApiResponse {
  itemSpec: DocumentChunk;
}

export class KnowledgeApiService {
  private static readonly BASE_URL = process.env.REACT_APP_KNOWLEDGE_API_BASE_URL || 'https://learnknowledge-int.azurewebsites.net/api/document';

  /**
   * Fetch document chunk by ID using user delegated permissions
   * @param documentChunkId - The document chunk ID to fetch
   * @param accessToken - User access token from Microsoft Entra ID
   * @returns Promise<DocumentChunk>
   */
  static async fetchDocumentChunk(
    documentChunkId: string,
    accessToken: string
  ): Promise<DocumentChunk> {
    try {
      const fullUrl = `${this.BASE_URL}/items/${documentChunkId}/itemspec`;
      console.log('Making API request to URL:', fullUrl);
      console.log('BASE_URL:', this.BASE_URL);
      console.log('Making API request with token:', accessToken.substring(0, 20) + '...');
      
      // Use fetch instead of axios to avoid any proxy issues
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('API response received:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You may not have permission to access this resource.');
        } else if (response.status === 404) {
          throw new Error('Document chunk not found. Please check the ID and try again.');
        } else {
          const errorText = await response.text();
          throw new Error(`API Error (${response.status}): ${errorText}`);
        }
      }

      const data: KnowledgeApiResponse = await response.json();
      return data.itemSpec;
    } catch (error) {
      console.error('API Error details:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while fetching the document');
    }
  }

  /**
   * Test API connectivity with user token
   * @param accessToken - User access token
   * @returns Promise<boolean>
   */
  static async testConnection(accessToken: string): Promise<boolean> {
    try {
      // Try a simple request to test connectivity using fetch
      const response = await fetch(`${this.BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.log('Connection test failed:', error);
      return false;
    }
  }
}
