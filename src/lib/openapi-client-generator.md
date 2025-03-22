# Frontend OpenAPI Client Generator Guide

This guide explains how to generate TypeScript clients from the OpenAPI specification to maintain a consistent contract between the frontend and backend.

## Prerequisites

- Node.js installed
- npm or yarn

## Steps to Generate and Use OpenAPI Clients

### 1. Install Required Dependencies

```bash
# Install OpenAPI Generator and TypeScript Fetch
npm install --save-dev @openapitools/openapi-generator-cli
```

### 2. Add Scripts to package.json

Add the following scripts to your frontend's `package.json` file:

```json
{
  "scripts": {
    "fetch-openapi": "wget -O ./src/api/openapi-spec.json http://localhost:8080/api/openapi/download-spec",
    "generate-api-client": "openapi-generator-cli generate -i ./src/api/openapi-spec.json -g typescript-fetch -o ./src/api/generated --additional-properties=typescriptThreePlus=true,supportsES6=true",
    "update-api": "npm run fetch-openapi && npm run generate-api-client"
  }
}
```

### 3. Create Directory Structure

```bash
mkdir -p src/api/generated
```

### 4. Generate the API Client

Make sure your backend is running, then run:

```bash
npm run update-api
```

This will:
1. Download the latest OpenAPI specification from your backend
2. Generate TypeScript client code based on that specification

### 5. Create an API Client Wrapper

Create a file `src/api/client.ts` to wrap the generated API client:

```typescript
import { Configuration, DefaultApi } from './generated';

// Create base API instance
const getApiClient = () => {
  const config = new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    middleware: [
      {
        pre: async (context) => {
          // Get the token from localStorage
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          
          // If token exists, add it to the request headers
          if (token) {
            context.init.headers = {
              ...context.init.headers,
              Authorization: `Bearer ${token}`,
            };
          }
          
          return context;
        },
      },
    ],
  });

  return new DefaultApi(config);
};

// Export the API client instance
export const apiClient = getApiClient();

// Export types from the generated client
export * from './generated';
```

### 6. Using the API Client in Components

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getAllPublishedExams();
        setExams(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch exams');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Render your component using the fetched data
};
```

## Benefits of Using the Generated Client

1. **Type Safety**: Full TypeScript definitions for all API responses and requests
2. **Auto-completion**: Your IDE will suggest the correct properties and methods
3. **Contract Consistency**: The client will always match the backend API exactly
4. **Reduced Bugs**: Type checking helps catch errors at compile time instead of runtime
5. **Better Developer Experience**: No need to manually create or maintain API client code

## Keeping the API Client Updated

When the backend API changes, simply run:

```bash
npm run update-api
```

This will regenerate all the TypeScript client code based on the latest API specification.

## Advanced Usage

### Error Handling

You can enhance the client wrapper with better error handling:

```typescript
// In client.ts
middleware: [
  {
    post: async (context) => {
      if (!context.response.ok) {
        const errorData = await context.response.json();
        // Create a custom error object with details from the response
        throw {
          status: context.response.status,
          message: errorData.message || 'An error occurred',
          data: errorData
        };
      }
      return context;
    }
  }
]
```

### Custom Hooks

Create custom hooks for common API operations:

```typescript
// src/hooks/useExams.js
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export const useExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAllPublishedExams();
      setExams(response.data || []);
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to fetch exams');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return { exams, loading, error, refetch: fetchExams };
};
```
