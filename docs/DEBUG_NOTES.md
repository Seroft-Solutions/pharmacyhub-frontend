# Debugging Authentication Issues

## Common Issues and Solutions

### 1. Token Not Available
If you see "No access token available" in the logs:
```typescript
// Check these storage keys
localStorage.getItem('pharmacyhub_access_token')
localStorage.getItem('pharmacyhub_refresh_token')
localStorage.getItem('pharmacyhub_token_expiry')
```

### 2. Token Not Being Sent
If API requests are failing with 401/403:
- Check Network tab in DevTools
- Look for Authorization header
- Verify token format starts with "Bearer "

### 3. Token Refresh Issues
Refresh flow:
1. Original request fails with 401
2. tokenManager.refreshToken() is called
3. New token is obtained and stored
4. Original request is retried

Debug points:
```typescript
// In apiClient.ts
logger.debug('Request failed, attempting refresh', { status, endpoint });

// In tokenManager.ts
logger.debug('Token refresh initiated', { 
  hasRefreshToken: Boolean(this.getStoredRefreshToken())
});

// In authService.ts
logger.debug('Auth state update', { 
  isAuthenticated: this.isAuthenticated(),
  hasToken: Boolean(token)
});
```

### 4. Token Storage Locations
Tokens are stored in multiple places for different purposes:

1. localStorage
   - Main persistence layer
   - Survives page reloads
   ```typescript
   // Check all auth storage
   Object.keys(localStorage).filter(key => key.startsWith('pharmacyhub_'))
   ```

2. tokenManager
   - In-memory cache
   - Used for API requests
   ```typescript
   tokenManager.hasToken() // Check if valid token exists
   tokenManager.getToken() // Get current token with Bearer prefix
   ```

3. authService
   - Manages auth state
   - Handles token refresh
   ```typescript
   authService.isAuthenticated() // Check auth status
   ```

### 5. Development Tools

#### Token Debugger
```typescript
import { debugJwtToken } from '@/shared/auth/utils';

const token = tokenManager.getToken();
const debug = debugJwtToken(token);
console.log('Token debug:', debug);
```

#### Storage Inspector
```typescript
function inspectAuthStorage() {
  const storage = {
    access: localStorage.getItem('pharmacyhub_access_token'),
    refresh: localStorage.getItem('pharmacyhub_refresh_token'),
    expiry: localStorage.getItem('pharmacyhub_token_expiry'),
    profile: localStorage.getItem('pharmacyhub_user_profile')
  };
  
  console.table(storage);
}
```

### 6. Common Error States

```typescript
// Token expired
if (now >= tokenExpiry) {
  logger.warn('Token expired', {
    expiry: new Date(tokenExpiry).toISOString(),
    now: new Date().toISOString()
  });
}

// Token refresh failed
if (!refreshResponse.ok) {
  logger.error('Token refresh failed', {
    status: refreshResponse.status,
    body: await refreshResponse.text()
  });
}

// Auth sync issue
if (tokenManager.hasToken() && !authService.isAuthenticated()) {
  logger.warn('Auth state mismatch', {
    tokenExists: true,
    authState: false
  });
}
```

## Testing Authentication

### Unit Tests
```typescript
describe('TokenManager', () => {
  it('should handle token refresh', async () => {
    const manager = new EnhancedTokenManager();
    await manager.refreshToken();
    expect(manager.hasToken()).toBe(true);
  });
});
```

### Integration Tests
```typescript
describe('Auth Flow', () => {
  it('should maintain auth state across requests', async () => {
    await authService.login(credentials);
    const firstResponse = await examService.getPublishedExams();
    await delay(100);
    const secondResponse = await examService.getPublishedExams();
    expect(secondResponse.status).toBe(200);
  });
});
