# Task 13: Apply Single Responsibility Principle

## Description
Apply the Single Responsibility Principle (SRP) across the core modules, ensuring that each component, function, and class has a clear, focused purpose that can be described in a single sentence.

## Implementation Steps

1. **SRP Audit**
   - Review components, functions, and classes across core modules
   - Identify instances of mixed responsibilities
   - Prioritize components based on complexity and importance
   - Create a list of items that need refactoring

2. **Responsibility Definition**
   - For each component, clearly define its responsibility in a single sentence
   - Document this responsibility in a comment at the top of the component
   - Identify any responsibilities that fall outside this definition

3. **Component Responsibility Refactoring**
   - Extract additional responsibilities to new components
   - Ensure each component has exactly one reason to change
   - Apply composition to maintain functionality
   - Update tests to reflect new component boundaries

4. **Function Responsibility Refactoring**
   - Extract additional responsibilities to new functions
   - Ensure each function does one thing well
   - Apply functional composition where appropriate
   - Update tests for refactored functions

5. **Module Responsibility Refactoring**
   - Ensure each module has a clear, cohesive purpose
   - Move functions and components to more appropriate modules if needed
   - Update imports across the codebase

6. **Documentation Update**
   - Update component documentation to clearly state responsibilities
   - Update module README.md files
   - Create examples of SRP application

## Refactoring Examples

### Before: Mixed Responsibility Component

```typescript
// Before: UserProfileCard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api';

export const UserProfileCard = ({ userId }) => {
  // Data fetching responsibility
  const { data: user, isLoading, error } = useQuery(
    ['user', userId],
    async () => {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    }
  );
  
  // Error handling responsibility
  if (error) {
    return <div className="error-card">Failed to load user: {error.message}</div>;
  }
  
  // Loading state responsibility
  if (isLoading) {
    return <div className="loading-card">Loading user...</div>;
  }
  
  // Data formatting responsibility
  const formattedJoinDate = new Date(user.joinDate).toLocaleDateString();
  
  // Role-based display responsibility
  const canEditProfile = user.role === 'admin' || user.id === currentUserId;
  
  // UI rendering responsibility
  return (
    <div className="profile-card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Joined: {formattedJoinDate}</p>
      {canEditProfile && <button>Edit Profile</button>}
    </div>
  );
};
```

### After: Separated Responsibilities

```typescript
// After: Container component - UserProfileCardContainer.tsx
import React from 'react';
import { useUserQuery } from '../api/userQueries';
import { UserProfileCard } from './UserProfileCard';
import { ErrorCard } from '@/core/ui/feedback/ErrorCard';
import { LoadingCard } from '@/core/ui/feedback/LoadingCard';
import { useCanEditProfile } from '../hooks/usePermissions';

// Responsibility: Manage data fetching and state for user profile
export const UserProfileCardContainer = ({ userId }) => {
  const { data: user, isLoading, error } = useUserQuery(userId);
  const canEditProfile = useCanEditProfile(user);
  
  if (error) {
    return <ErrorCard message={`Failed to load user: ${error.message}`} />;
  }
  
  if (isLoading) {
    return <LoadingCard message="Loading user..." />;
  }
  
  return <UserProfileCard user={user} canEdit={canEditProfile} />;
};
```

```typescript
// After: Presentation component - UserProfileCard.tsx
import React from 'react';
import { formatDate } from '@/core/utils/dateUtils';

// Responsibility: Render user profile UI based on provided data
export const UserProfileCard = ({ user, canEdit }) => {
  const formattedJoinDate = formatDate(user.joinDate);
  
  return (
    <div className="profile-card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Joined: {formattedJoinDate}</p>
      {canEdit && <button>Edit Profile</button>}
    </div>
  );
};
```

```typescript
// hooks/useUserQuery.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api';

// Responsibility: Handle user data fetching from API
export const useUserQuery = (userId) => {
  return useQuery(
    ['user', userId],
    async () => {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    },
    {
      enabled: !!userId,
    }
  );
};
```

```typescript
// hooks/usePermissions.ts
import { useAuthStore } from '@/core/auth/state/authStore';

// Responsibility: Determine if current user can edit a profile
export const useCanEditProfile = (user) => {
  const currentUser = useAuthStore(state => state.user);
  
  if (!user || !currentUser) return false;
  
  return user.id === currentUser.id || currentUser.role === 'admin';
};
```

## Verification Criteria
- Each component has a single, clearly defined responsibility
- Each function does one thing well
- Responsibilities are properly separated
- Components are properly composed
- Functions are properly composed
- Documentation clearly states responsibilities
- Test coverage maintained or improved

## Time Estimate
Approximately 3-4 days

## Dependencies
- Task 12: Apply Component Size Limitations

## Risks
- May introduce bugs during refactoring
- May affect component functionality if responsibilities aren't properly separated
- May require significant changes to tests
