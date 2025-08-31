import React from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import App from './App';
import './index.css';

// Create MSAL instance with error handling
let msalInstance: PublicClientApplication;
try {
  msalInstance = new PublicClientApplication(msalConfig);
  console.log('MSAL instance created successfully');
  console.log('Client ID:', msalConfig.auth.clientId);
  console.log('Authority:', msalConfig.auth.authority);
} catch (error) {
  console.error('Failed to create MSAL instance:', error);
  throw error;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
