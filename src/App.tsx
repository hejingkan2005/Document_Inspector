import React, { useState, useCallback, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, tokenRequest, knowledgeApiTokenRequest, fallbackTokenRequest } from './authConfig';
import { KnowledgeApiService, DocumentChunk } from './services/knowledgeApi';
import DocumentSearch from './components/DocumentSearch';
import MetadataDisplay from './components/MetadataDisplay';
import ContentDisplay from './components/ContentDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import './App.css';

interface AppState {
  isLoading: boolean;
  error: string | null;
  documentChunk: DocumentChunk | null;
  isAuthenticated: boolean;
  userInfo: {
    name?: string;
    email?: string;
  } | null;
}

function App() {
  const { instance, accounts, inProgress } = useMsal();
  
  const [state, setState] = useState<AppState>({
    isLoading: false,
    error: null,
    documentChunk: null,
    isAuthenticated: false,
    userInfo: null,
  });

  // Check authentication status and get user info
  useEffect(() => {
    const updateAuthState = () => {
      const isAuthenticated = accounts.length > 0;
      let userInfo: { name?: string; email?: string; } | null = null;
      
      if (isAuthenticated && accounts[0]) {
        const account = accounts[0];
        userInfo = {
          name: account.name || account.username,
          email: account.username,
        };
      }
      
      setState(prev => ({
        ...prev,
        isAuthenticated,
        userInfo,
      }));
    };

    updateAuthState();
  }, [accounts]);

  // Acquire access token for signed-in user with fallback strategy
  const getAccessToken = useCallback(async (): Promise<string> => {
    try {
      if (accounts.length === 0) {
        // No user is signed in, initiate login with basic scopes
        console.log('No active account, starting login...');
        const loginResponse = await instance.loginPopup(loginRequest);
        console.log('Login successful:', loginResponse);
      }

      const account = accounts[0] || instance.getActiveAccount();
      if (!account) {
        throw new Error('No active account found after login');
      }

      // Strategy 1: Try to get Knowledge API token silently
      try {
        const response = await instance.acquireTokenSilent({
          ...knowledgeApiTokenRequest,
          account: account,
        });
        console.log('Knowledge API token acquired silently');
        return response.accessToken;
      } catch (silentError) {
        console.log('Silent Knowledge API token acquisition failed:', silentError);
        
        // Strategy 2: Try to get Knowledge API token via popup
        try {
          const response = await instance.acquireTokenPopup({
            ...knowledgeApiTokenRequest,
            account: account,
          });
          console.log('Knowledge API token acquired via popup');
          return response.accessToken;
        } catch (popupError) {
          console.log('Popup Knowledge API token acquisition failed:', popupError);
          
          // Strategy 3: Fallback to basic Graph token
          try {
            const response = await instance.acquireTokenSilent({
              ...fallbackTokenRequest,
              account: account,
            });
            console.log('Fallback token acquired silently');
            return response.accessToken;
          } catch (fallbackError) {
            console.log('Fallback silent token acquisition failed:', fallbackError);
            
            // Strategy 4: Last resort - popup for basic token
            const response = await instance.acquireTokenPopup({
              ...fallbackTokenRequest,
              account: account,
            });
            console.log('Fallback token acquired via popup');
            return response.accessToken;
          }
        }
      }
    } catch (error) {
      console.error('All token acquisition strategies failed:', error);
      throw new Error('Failed to acquire access token. Please try signing in again.');
    }
  }, [instance, accounts]);

  // Handle document search
  const handleSearch = useCallback(async (documentChunkId: string) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      documentChunk: null,
    }));

    try {
      // Get access token
      const accessToken = await getAccessToken();
      
      // Fetch document chunk
      const documentChunk = await KnowledgeApiService.fetchDocumentChunk(
        documentChunkId,
        accessToken
      );

      setState(prev => ({
        ...prev,
        isLoading: false,
        documentChunk,
      }));
    } catch (error) {
      console.error('Search failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  }, [getAccessToken]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      await instance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (error) {
      console.error('Sign out failed:', error);
      // Force clear the cache as a fallback
      await instance.clearCache();
      window.location.reload();
    }
  }, [instance]);

  // Handle clearing authentication cache
  const handleClearCache = useCallback(async () => {
    try {
      await instance.clearCache();
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        userInfo: null,
        error: null,
      }));
      console.log('Authentication cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, [instance]);

  // Handle sign in
  const handleSignIn = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      console.log('Starting sign in process...');
      const response = await instance.loginPopup(loginRequest);
      console.log('Sign in successful:', response);
    } catch (error) {
      console.error('Sign in failed:', error);
      setState(prev => ({
        ...prev,
        error: `Sign in failed: ${error instanceof Error ? error.message : 'Unknown error'}. Try clearing cache if the problem persists.`,
      }));
    }
  }, [instance]);

  // Loading state during MSAL initialization
  if (inProgress === 'startup') {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        {!state.isAuthenticated ? (
          <div className="auth-container">
            <h1>Document Inspector</h1>
            <p>Please sign in with your Microsoft account to access the Knowledge API.</p>
            <div className="auth-buttons">
              <button onClick={handleSignIn} className="sign-in-button">
                Sign In with Microsoft
              </button>
              <button onClick={handleClearCache} className="clear-cache-button">
                Clear Cache
              </button>
            </div>
            {state.error && (
              <div className="auth-error">
                <p>{state.error}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* User Info Header */}
            {state.userInfo && (
              <div className="user-info-header">
                <div className="user-details">
                  <span className="user-name">Welcome, {state.userInfo.name || state.userInfo.email}</span>
                  <span className="user-email">{state.userInfo.email}</span>
                </div>
                <button onClick={handleSignOut} className="sign-out-button">
                  Sign Out
                </button>
              </div>
            )}
            
            <DocumentSearch onSearch={handleSearch} isLoading={state.isLoading} />
            
            {state.error && (
              <ErrorDisplay error={state.error} onRetry={handleRetry} />
            )}
            
            {state.documentChunk && (
              <div className="results-container">
                <MetadataDisplay metadata={state.documentChunk.metadata} />
                <ContentDisplay 
                  content={state.documentChunk.content} 
                  isLoading={state.isLoading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
