import { Configuration, PopupRequest } from '@azure/msal-browser';

// MSAL configuration for user sign-in (not managed identity)
export const msalConfig: Configuration = {
  auth: {
    clientId: 'fd972449-9448-4dce-9df1-c1edac7b2225',
    authority: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Login request for user authentication
export const loginRequest: PopupRequest = {
  scopes: [
    'https://graph.microsoft.com/User.Read', // Basic user profile - this should always work
  ],
};

// Token request for Knowledge API - using delegated permissions
export const tokenRequest = {
  scopes: ['https://graph.microsoft.com/User.Read'], // Start with basic scope that works
  forceRefresh: false,
};

// Alternative token request for Knowledge API (if available)
export const knowledgeApiTokenRequest = {
  scopes: ['api://7c78db7f-b420-4cb8-b448-fc0015661260/user_impersonation'],
  forceRefresh: false,
};

// Fallback scopes for basic authentication
export const fallbackTokenRequest = {
  scopes: ['https://graph.microsoft.com/User.Read'],
  forceRefresh: false,
};
