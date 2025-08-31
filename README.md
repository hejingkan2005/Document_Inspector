# Document Inspector

A React TypeScript application for inspecting document chunks from the Microsoft Knowledge API with Azure AD authentication.

## Features

- **Microsoft Entra ID User Authentication**: Secure user sign-in using MSAL (Microsoft Authentication Library)
- **Delegated Permissions**: Access the Knowledge API on behalf of the signed-in user
- **Document Chunk Viewer**: Search and display document chunks by ID
- **Metadata Display**: Shows document metadata including chunk ID, URL, title, depot name, last updated date, and page type
- **Markdown Content Rendering**: Displays document content with full markdown support
- **User Profile Display**: Shows signed-in user information with sign-out functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error handling for API failures and authentication issues

## Prerequisites

- Node.js (version 16 or later)
- npm or yarn package manager
- Microsoft Entra ID application registration with the following:
  - Client ID: `fd972449-9448-4dce-9df1-c1edac7b2225`
  - Delegated permissions for the Knowledge API scope: `api://5405974b-a0ac-4de0-80e0-9efe337ea291/access_as_user`
  - Microsoft Graph User.Read permission for basic user profile
- A Microsoft work or school account with access to the Knowledge API

## Installation

1. Clone or download the repository
2. Navigate to the project directory:
   ```bash
   cd Document_Inspector
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The application is pre-configured with the required settings in the `.env` file:

- `REACT_APP_CLIENT_ID`: Microsoft Entra ID client ID
- `REACT_APP_SCOPE`: API scope for the Knowledge service
- `REACT_APP_KNOWLEDGE_API_BASE_URL`: Base URL for the Knowledge API

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`
3. Sign in with your Microsoft account
4. Enter a document chunk ID to search and view the document

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `build` directory.

## API Integration

The application integrates with the Microsoft Knowledge API:
- **Endpoint**: `https://learn.microsoft.com/api/knowledge/document/items/{document-chunk-id}/itemspec`
- **Authentication**: Bearer token from Microsoft Entra ID
- **Response**: Document metadata and content in markdown format

## Project Structure

```
src/
├── components/           # React components
│   ├── ContentDisplay.tsx    # Markdown content renderer
│   ├── DocumentSearch.tsx    # Search input component
│   ├── ErrorDisplay.tsx      # Error handling component
│   └── MetadataDisplay.tsx   # Document metadata display
├── services/            # API service layer
│   └── knowledgeApi.ts      # Knowledge API integration
├── App.tsx             # Main application component
├── authConfig.ts       # MSAL authentication configuration
├── index.tsx          # Application entry point
└── index.css          # Global styles
```

## Authentication Flow

1. User visits the application
2. User clicks "Sign In with Microsoft" button
3. MSAL redirects to Microsoft sign-in page
4. User signs in with their work/school account
5. After successful authentication, user is redirected back to the app
6. Access token is acquired on behalf of the signed-in user
7. Token is used for Knowledge API requests with delegated permissions
8. Token is automatically refreshed when needed
9. User can sign out to clear the session

## Error Handling

The application handles various error scenarios:
- Authentication failures
- API request failures
- Network connectivity issues
- Invalid document chunk IDs
- Token refresh failures

## Technologies Used

- **React 18** with TypeScript
- **MSAL React** for Microsoft authentication
- **Axios** for HTTP requests
- **React Markdown** for content rendering
- **CSS3** with responsive design

## License

This project is for demonstration purposes.
