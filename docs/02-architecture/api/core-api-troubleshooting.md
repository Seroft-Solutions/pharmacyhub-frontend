# Core API Troubleshooting Guide

This guide provides solutions for common issues encountered when working with the core API module.

## Table of Contents

- [Network and Request Issues](#network-and-request-issues)
- [Query and Cache Issues](#query-and-cache-issues)
- [Mutation Issues](#mutation-issues)
- [TypeScript and Type Issues](#typescript-and-type-issues)
- [Performance Issues](#performance-issues)
- [Common Error Scenarios](#common-error-scenarios)
- [Debugging Tools and Techniques](#debugging-tools-and-techniques)

## Network and Request Issues

### API Requests Not Being Made

**Symptoms**:
- No network requests in browser dev tools
- Query stays in loading state indefinitely
- No data or error is returned

**Possible Causes and Solutions**:

1. **Query is disabled**
   
   Check if the `enabled` option is set to `false`:
   ```typescript
   // Is the enabled condition evaluating to false?
   enabled: !!id && someCondition
   ```

2. **Incorrect endpoint**
   
   Verify the endpoint is correct:
   ```typescript
   // Debug the actual endpoint
   console.log('Endpoint:', ENTITY_ENDPOINTS.DETAIL(id));
   ```

3. **Authentication issues**
   
   If the endpoint requires authentication, ensure the user is logged in and the token is being sent:
   ```typescript
   // Check if requiresAuth is properly set
   useApiQuery(queryKey, endpoint, { requiresAuth: true });
   ```

4. **Invalid query key dependencies**
   
   Ensure all dependencies in your query key are defined:
   ```typescript
   // Verify all parts of the query key are defined
   const queryKey = [entity, id]; // Is id defined?
   ```

### Authentication Failures

**Symptoms**:
- 401 Unauthorized responses
- 403 Forbidden responses
- Auth-required endpoints not working

**Possible Causes and Solutions**:

1. **Token expiration**
   
   The authentication token may have expired. Implement proper token refresh logic.

2. **Missing requiresAuth flag**
   
   Ensure the `requiresAuth` flag is set to `true` for endpoints that require authentication:
   ```typescript
   useApiQuery(queryKey, endpoint, { requiresAuth: true });
   ```

3. **Authentication configuration issues**
   
   Check the auth configuration in the core API client.

### CORS Issues

**Symptoms**:
- Browser console showing CORS errors
- Request failing with network error
- Preflight OPTIONS requests failing

**Possible Causes and Solutions**:

1. **Development server configuration**
   
   Ensure your development server is properly configured for CORS.

2. **Production API configuration**
   
   Verify the production API is configured to allow requests from your domains.

3. **Custom headers triggering preflight**
   
   Be aware that custom headers will trigger preflight OPTIONS requests that need to be handled by the server.

## Query and Cache Issues

### Stale Data Not Refreshing

**Symptoms**:
- Data doesn't update after mutations
- Old data persists in the UI
- Changes not reflected after known backend updates

**Possible Causes and Solutions**:

1. **Missing query invalidation**
   
   Ensure you're invalidating the correct queries after mutations:
   ```typescript
   onSuccess: (_, variables, context) => {
     context?.queryClient.invalidateQueries({
       queryKey: entityQueryKeys.lists(),
     });
   }
   ```

2. **Incorrect query key structure**
   
   Verify that the query key used for invalidation matches the one used for the query:
   ```typescript
   // Query
   const query = useApiQuery(
     entityQueryKeys.detail(id),
     ENTITY_ENDPOINTS.DETAIL(id)
   );
   
   // Invalidation
   context?.queryClient.invalidateQueries({
     queryKey: entityQueryKeys.detail(id), // Must match exactly
   });
   ```

3. **Caching configuration issues**
   
   Check if the `staleTime` or `cacheTime` is set too high:
   ```typescript
   useApiQuery(queryKey, endpoint, { 
     staleTime: 5 * 60 * 1000, // 5 minutes - too long?
   });
   ```

### Duplicate Requests

**Symptoms**:
- Multiple identical network requests
- Same queries being fired repeatedly
- Performance issues due to excessive requests

**Possible Causes and Solutions**:

1. **Multiple query instances with the same key**
   
   Ensure each unique query has a unique key:
   ```typescript
   // Different components using the same query
   // should have the same key for proper deduplication
   const key = ['entity', id];
   ```

2. **Missing deduplication flag**
   
   Verify the `deduplicate` option is not set to `false`:
   ```typescript
   useApiQuery(queryKey, endpoint, { deduplicate: true });
   ```

3. **Component remounting**
   
   If the component is remounting frequently, consider lifting the query to a parent component.

### Cache Persistence Issues

**Symptoms**:
- Data lost between page navigations
- Queries refetching unnecessarily
- State not persisting as expected

**Possible Causes and Solutions**:

1. **Query client configuration**
   
   Check the QueryClient configuration for proper persistence settings.

2. **Cache time too short**
   
   Increase the `cacheTime` for queries that should persist longer:
   ```typescript
   useApiQuery(queryKey, endpoint, { 
     cacheTime: 30 * 60 * 1000, // 30 minutes
   });
   ```

3. **Missing persistence plugin**
   
   Consider using a persistence plugin for TanStack Query if needed.

## Mutation Issues

### Mutation Not Executing

**Symptoms**:
- Mutation doesn't trigger when called
- No network request for the mutation
- No change in mutation state

**Possible Causes and Solutions**:

1. **Incorrect usage of mutate function**
   
   Ensure you're calling the mutate function correctly:
   ```typescript
   // Correct
   mutate(payload);
   
   // Incorrect
   // mutate; // Just referencing the function
   // const result = mutate(payload); // Trying to use the return value
   ```

2. **Missing or incorrect endpoint**
   
   Verify the endpoint is correct and accessible:
   ```typescript
   // Debug the actual endpoint
   console.log('Mutation endpoint:', 
     typeof endpoint === 'function' 
       ? endpoint(payload) 
       : endpoint
   );
   ```

3. **Payload validation issues**
   
   Check if the payload validation is failing:
   ```typescript
   // Log the payload
   console.log('Mutation payload:', payload);
   ```

### Optimistic Updates Not Working

**Symptoms**:
- UI doesn't update until server response
- Flickering UI during mutations
- Updates appear slow to users

**Possible Causes and Solutions**:

1. **Missing onMutate implementation**
   
   Implement optimistic updates with `onMutate`:
   ```typescript
   useApiMutation(endpoint, {
     onMutate: async (variables) => {
       // Cancel related queries
       await queryClient.cancelQueries({ queryKey });
       
       // Save previous value
       const previousData = queryClient.getQueryData(queryKey);
       
       // Optimistically update
       queryClient.setQueryData(queryKey, (old) => ({
         ...old,
         // Apply optimistic update
       }));
       
       // Return context for rollback
       return { previousData };
     },
     onError: (_, __, context) => {
       // Rollback on error
       queryClient.setQueryData(queryKey, context.previousData);
     }
   });
   ```

2. **Incorrect rollback logic**
   
   Ensure the rollback logic in `onError` correctly restores the previous state.

3. **Race conditions**
   
   Make sure to cancel in-flight queries before optimistic updates to prevent race conditions.

### Errors Not Handled

**Symptoms**:
- Uncaught exceptions during mutations
- No error feedback to users
- Failed mutations with no indication

**Possible Causes and Solutions**:

1. **Missing error handling**
   
   Implement proper error handling:
   ```typescript
   // In component
   const { mutate, error, isError } = useMutation();
   
   // Show error to user
   {isError && <ErrorMessage error={error} />}
   
   // In hook
   useApiMutation(endpoint, {
     onError: (error, variables, context) => {
       // Handle error (e.g., show toast, log)
       console.error('Mutation failed:', error);
     }
   });
   ```

2. **Incorrect error typing**
   
   Ensure proper typing for errors to handle them correctly:
   ```typescript
   useApiMutation<Data, ApiError, Variables>(endpoint, {
     onError: (error: ApiError) => {
       // Now you can access typed error properties
       if (error.status === 400) {
         // Handle validation error
       }
     }
   });
   ```

## TypeScript and Type Issues

### Type Inference Failures

**Symptoms**:
- TypeScript errors when using query/mutation results
- `any` or `unknown` types in the editor
- Missing property completions

**Possible Causes and Solutions**:

1. **Missing generic type parameters**
   
   Provide explicit type parameters:
   ```typescript
   // Specify the response data type
   useApiQuery<User, Error>(queryKey, endpoint);
   
   // For mutations, specify all types
   useApiMutation<User, Error, CreateUserPayload>(endpoint);
   ```

2. **Incorrect type definitions**
   
   Ensure your type definitions match the actual API responses:
   ```typescript
   // Define accurate interface for the API response
   interface ApiResponse<T> {
     data: T;
     meta: {
       page: number;
       total: number;
     };
   }
   
   // Use it in your query
   useApiQuery<ApiResponse<User[]>>(queryKey, endpoint);
   ```

3. **Missing or incorrect imports**
   
   Verify all types are properly imported:
   ```typescript
   import { User, ApiError } from '@/types';
   ```

### Incompatible Type Errors

**Symptoms**:
- TypeScript errors about incompatible types
- Property assignment errors
- Function argument type errors

**Possible Causes and Solutions**:

1. **Mismatched type definitions**
   
   Ensure types match between your frontend and API:
   ```typescript
   // API expects:
   interface CreateUserPayload {
     firstName: string; // Note the camelCase
     lastName: string;
   }
   
   // But you're sending:
   const payload = {
     first_name: 'John', // snake_case mismatch
     lastName: 'Doe'
   };
   ```

2. **Missing type transformations**
   
   Add transformation logic where needed:
   ```typescript
   // Transform the data to match the expected types
   const transformData = (apiData: ApiUser): User => ({
     id: apiData.id,
     name: `${apiData.first_name} ${apiData.last_name}`,
     // ...other transformations
   });
   
   useApiQuery<ApiUser, Error, User>(queryKey, endpoint, {
     select: transformData
   });
   ```

## Performance Issues

### Excessive Refetching

**Symptoms**:
- Too many network requests
- UI feels slow or stutters
- Network tab shows frequent refetching

**Possible Causes and Solutions**:

1. **Default stale time too low**
   
   Increase the stale time for queries that don't change often:
   ```typescript
   useApiQuery(queryKey, endpoint, {
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

2. **Overly aggressive refetch settings**
   
   Adjust refetch settings based on data volatility:
   ```typescript
   useApiQuery(queryKey, endpoint, {
     refetchOnWindowFocus: false, // Disable if not needed
     refetchOnMount: false, // Disable if data doesn't change often
     refetchOnReconnect: true, // Keep enabled for mobile or unstable connections
   });
   ```

3. **Query key instability**
   
   Ensure query keys are stable and don't change unnecessarily:
   ```typescript
   // Bad: Creates new object on every render
   const queryKey = ['entities', { filters }];
   
   // Good: Uses stable reference
   const stableFilters = useMemo(() => filters, [
     filters.status,
     filters.type
     // Only dependencies that actually matter
   ]);
   const queryKey = ['entities', stableFilters];
   ```

### Memory Usage Issues

**Symptoms**:
- Increasing memory usage over time
- Performance degradation
- Browser tab crashes or becomes slow

**Possible Causes and Solutions**:

1. **Cache growing too large**
   
   Set appropriate cache time to allow garbage collection:
   ```typescript
   useApiQuery(queryKey, endpoint, {
     cacheTime: 15 * 60 * 1000, // 15 minutes
   });
   ```

2. **QueryClient configuration**
   
   Configure the QueryClient with appropriate max cache size:
   ```typescript
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         // Default settings
       }
     },
     queryCache: new QueryCache({
       onError: (error) => {
         console.error('Query error:', error);
       }
     }),
     // Set maximum number of active queries
     // to prevent memory issues
   });
   ```

3. **Large query responses**
   
   For large responses, consider:
   - Paginating data
   - Implementing virtual scrolling
   - Using data transformations to store only necessary data

## Common Error Scenarios

### 401 Unauthorized Errors

**Symptoms**:
- 401 status code responses
- Authentication failures
- Unable to access protected endpoints

**Solutions**:

1. **Check authentication token**
   
   Verify the token is present and valid.

2. **Implement token refresh**
   
   Add logic to refresh expired tokens.

3. **Verify requiresAuth flag**
   
   Ensure protected endpoints use `{ requiresAuth: true }`.

### 404 Not Found Errors

**Symptoms**:
- 404 status code responses
- "Resource not found" errors
- Empty data responses

**Solutions**:

1. **Verify endpoint URL**
   
   Check the endpoint construction:
   ```typescript
   console.log('Endpoint:', ENTITY_ENDPOINTS.DETAIL(id));
   ```

2. **Validate resource IDs**
   
   Ensure resource IDs are valid and exist.

3. **Check API version**
   
   Verify you're using the correct API version.

### 422 Validation Errors

**Symptoms**:
- 422 status code responses
- Validation failure messages
- Mutation rejections due to invalid data

**Solutions**:

1. **Validate data before submission**
   
   Implement frontend validation:
   ```typescript
   const validate = (data) => {
     const errors = {};
     if (!data.name) errors.name = 'Name is required';
     // ...more validations
     return Object.keys(errors).length ? errors : null;
   };
   
   const handleSubmit = () => {
     const errors = validate(formData);
     if (errors) {
       setFormErrors(errors);
       return;
     }
     mutate(formData);
   };
   ```

2. **Check payload structure**
   
   Ensure the payload matches what the API expects:
   ```typescript
   // Log the exact payload being sent
   console.log('Mutation payload:', formData);
   ```

3. **Handle validation errors specifically**
   
   Parse and display validation errors to users:
   ```typescript
   useApiMutation(endpoint, {
     onError: (error) => {
       if (error.status === 422) {
         // Extract and set validation errors
         setFormErrors(error.data.errors);
       } else {
         // Handle other errors
         showErrorToast(error.message);
       }
     }
   });
   ```

## Debugging Tools and Techniques

### React Query Devtools

The React Query Devtools provide visibility into query and mutation state:

```tsx
// In your app component
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      <MyApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

Use the devtools to:
- View active queries and their state
- Inspect query data and error details
- Manually refetch or invalidate queries
- Check query timing and staleness

### Network Request Debugging

Use the browser's network tab for request-level debugging:

1. **Filter requests**
   
   Filter the network tab to show only API requests:
   - In Chrome: Filter by domain or type "fetch" or "xhr"
   - In Firefox: Use the "XHR" filter

2. **Inspect request details**
   
   Check headers, payload, and response for each request.

3. **Monitor timing**
   
   Use the timing information to identify slow requests.

### Query Key Debugging

Add logging to debug query key issues:

```typescript
// Log query keys for debugging
console.log('Query key:', JSON.stringify(queryKey));

// In the mutation success handler
onSuccess: (_, variables, context) => {
  console.log('Invalidating query key:', JSON.stringify(someQueryKey));
  context?.queryClient.invalidateQueries({
    queryKey: someQueryKey,
  });
}
```

### API Response Debugging

Intercept API responses for debugging:

```typescript
// Add a debug interceptor to the API client
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`Error from ${error.config?.url}:`, error);
    return Promise.reject(error);
  }
);
```

### Verbose Logging Mode

Implement a verbose logging mode for development:

```typescript
// Create a debug logger
const DEBUG = process.env.NODE_ENV !== 'production';

export const apiLogger = {
  log: (...args) => {
    if (DEBUG) console.log('[API]', ...args);
  },
  error: (...args) => {
    if (DEBUG) console.error('[API]', ...args);
  },
  warn: (...args) => {
    if (DEBUG) console.warn('[API]', ...args);
  }
};

// Use in your API hooks
export function useEntityQuery(id) {
  apiLogger.log(`Fetching entity ${id}`);
  return useApiQuery(...);
}
```

---

For issues not covered by this guide or if you need further assistance, please contact the architecture team.
