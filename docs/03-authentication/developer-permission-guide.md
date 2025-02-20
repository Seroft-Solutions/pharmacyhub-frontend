# PharmacyHub Developer Permission Guide

## Introduction

This guide provides practical instructions for developers implementing permission-based access control in PharmacyHub components. Following these guidelines ensures consistent security enforcement and maintainable code.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Frontend Implementation](#frontend-implementation)
3. [Backend Implementation](#backend-implementation)
4. [Testing Permission Logic](#testing-permission-logic)
5. [Common Patterns](#common-patterns)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Basic understanding of React hooks and components
- Familiarity with Next.js routing
- Knowledge of JWT authentication

### Key Files and Locations

```
/src/
├── shared/
│   └── auth/
│       ├── index.ts                  # Main export file
│       ├── permissions.ts            # Permission constants
│       ├── AuthContext.tsx           # Authentication context
│       ├── keycloakService.ts        # Keycloak integration
│       └── PermissionGuard.tsx       # Permission guard components
└── app/
    └── api/
        └── auth/
            └── [...nextauth]/        # Next Auth configuration
```

### Import Statements

Always import permissions and guard components from the central module:

```typescript
import { 
  PERMISSIONS,
  PermissionGuard,
  RoleGuard,
  usePermission,
  useRole
} from '@/shared/auth';
```

## Frontend Implementation

### Basic Permission Check

Use the `usePermission` hook for basic permission checks:

```tsx
import { usePermission, PERMISSIONS } from '@/shared/auth';

const MyComponent = () => {
  const { canAccess, loading } = usePermission(PERMISSIONS.PHARMACY.CREATE);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {canAccess ? (
        <CreatePharmacyForm />
      ) : (
        <p>You don't have permission to create pharmacies.</p>
      )}
    </div>
  );
};
```

### Permission Guards

Use guard components to conditionally render UI based on permissions:

```tsx
import { PermissionGuard, PERMISSIONS } from '@/shared/auth';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Only shown to users with create:pharmacy permission */}
      <PermissionGuard 
        permission={PERMISSIONS.PHARMACY.CREATE}
        fallback={<p>You need pharmacy creation permission</p>}
      >
        <CreatePharmacySection />
      </PermissionGuard>
      
      {/* Only shown to users with any of these permissions */}
      <AnyPermissionGuard
        permissions={[
          PERMISSIONS.PHARMACY.EDIT,
          PERMISSIONS.PHARMACY.MANAGE
        ]}
      >
        <ManagePharmaciesSection />
      </AnyPermissionGuard>
      
      {/* Only shown to users with both permissions */}
      <AllPermissionsGuard
        permissions={[
          PERMISSIONS.REPORTS.VIEW,
          PERMISSIONS.PHARMACY.VIEW
        ]}
      >
        <PharmacyReportsSection />
      </AllPermissionsGuard>
    </div>
  );
};
```

### Role-Based Guards

Use role guards for broader access control:

```tsx
import { RoleGuard } from '@/shared/auth';

const AdminArea = () => {
  return (
    <RoleGuard
      role="ADMIN"
      fallback={<AccessDeniedPage />}
    >
      <AdminDashboard />
    </RoleGuard>
  );
};
```

### Handling Multiple Permissions

For complex permission logic, combine hooks with custom logic:

```tsx
import { usePermission, PERMISSIONS } from '@/shared/auth';

const ComplexPermissionComponent = () => {
  const { canAccess: canCreate } = usePermission(PERMISSIONS.PHARMACY.CREATE);
  const { canAccess: canApprove } = usePermission(PERMISSIONS.PHARMACY.APPROVE);
  const { canAccess: canView } = usePermission(PERMISSIONS.REPORTS.VIEW);
  
  // Custom business logic combining permissions
  const canAccessAdvancedFeatures = (canCreate && canView) || canApprove;
  
  return (
    <div>
      {canAccessAdvancedFeatures && <AdvancedFeatures />}
    </div>
  );
};
```

### UI Element Disabling

Disable UI elements rather than hiding them when appropriate:

```tsx
import { usePermission, PERMISSIONS } from '@/shared/auth';

const ActionButtons = ({ pharmacyId }) => {
  const { canAccess: canEdit } = usePermission(PERMISSIONS.PHARMACY.EDIT);
  const { canAccess: canDelete } = usePermission(PERMISSIONS.PHARMACY.DELETE);
  
  return (
    <div className="button-group">
      <Button
        onClick={() => editPharmacy(pharmacyId)}
        disabled={!canEdit}
        title={!canEdit ? "You don't have permission to edit" : ""}
      >
        Edit
      </Button>
      
      <Button
        onClick={() => deletePharmacy(pharmacyId)}
        disabled={!canDelete}
        title={!canDelete ? "You don't have permission to delete" : ""}
      >
        Delete
      </Button>
    </div>
  );
};
```

### Route Protection

Protect routes with the Next.js middleware:

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { PERMISSIONS } from '@/shared/auth/permissions';

const PERMISSION_ROUTES = {
  '/admin': { requiredRole: 'ADMIN' },
  '/pharmacy/new': { requiredPermission: PERMISSIONS.PHARMACY.CREATE },
  '/reports': { requiredPermission: PERMISSIONS.REPORTS.VIEW },
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check route permissions
  for (const [route, requirements] of Object.entries(PERMISSION_ROUTES)) {
    if (pathname.startsWith(route)) {
      const auth = await verifyAuth(request);
      
      if (!auth.isAuthenticated) {
        return redirectToLogin(request);
      }
      
      if (requirements.requiredRole && !auth.hasRole(requirements.requiredRole)) {
        return redirectToAccessDenied(request);
      }
      
      if (requirements.requiredPermission && 
          !auth.hasPermission(requirements.requiredPermission)) {
        return redirectToAccessDenied(request);
      }
    }
  }
  
  return NextResponse.next();
}
```

## Backend Implementation

### Spring Security Configuration

Configure Spring Security to use JWT and check permissions:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(
                jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter())
            ))
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/pharmacies").hasAuthority("view:pharmacy")
                .requestMatchers("/api/pharmacies/create").hasAuthority("create:pharmacy")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
        return http.build();
    }
    
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("permissions");
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}
```

### Method-Level Security

Use Spring method security annotations:

```java
@RestController
@RequestMapping("/api/pharmacies")
public class PharmacyController {

    @GetMapping
    @PreAuthorize("hasAuthority('view:pharmacy')")
    public List<PharmacyDTO> getAllPharmacies() {
        // Implementation
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('create:pharmacy')")
    public PharmacyDTO createPharmacy(@RequestBody PharmacyRequest request) {
        // Implementation
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('edit:pharmacy')")
    public PharmacyDTO updatePharmacy(@PathVariable Long id, @RequestBody PharmacyRequest request) {
        // Implementation
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('delete:pharmacy')")
    public void deletePharmacy(@PathVariable Long id) {
        // Implementation
    }
}
```

### Custom Permission Evaluation

For complex permission logic, use SpEL expressions:

```java
@Service
public class PharmacyService {

    @PreAuthorize("hasAuthority('view:pharmacy') or @pharmacyPermissionEvaluator.isOwner(#pharmacyId, principal)")
    public PharmacyDTO getPharmacyById(Long pharmacyId) {
        // Implementation
    }
    
    @PreAuthorize("(hasAuthority('manage:pharmacy') and @pharmacyPermissionEvaluator.isInSameRegion(#pharmacyId, principal)) " +
                 "or hasAuthority('admin:pharmacy')")
    public void approvePharmacy(Long pharmacyId) {
        // Implementation
    }
}
```

### Permission Evaluator

Create custom permission evaluators for business-specific logic:

```java
@Component
public class PharmacyPermissionEvaluator {

    private final PharmacyRepository pharmacyRepository;
    private final UserRepository userRepository;
    
    // Constructor injection...
    
    public boolean isOwner(Long pharmacyId, Authentication authentication) {
        String userId = ((KeycloakPrincipal) authentication.getPrincipal()).getName();
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId).orElse(null);
        
        if (pharmacy == null) {
            return false;
        }
        
        return pharmacy.getOwnerId().equals(userId);
    }
    
    public boolean isInSameRegion(Long pharmacyId, Authentication authentication) {
        String userId = ((KeycloakPrincipal) authentication.getPrincipal()).getName();
        User user = userRepository.findById(userId).orElse(null);
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId).orElse(null);
        
        if (user == null || pharmacy == null) {
            return false;
        }
        
        return user.getRegionId().equals(pharmacy.getRegionId());
    }
}
```

## Testing Permission Logic

### Frontend Testing

Test permission guards with mock authentication context:

```typescript
// AuthContext.test.tsx
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/shared/auth/AuthContext';
import { PermissionGuard, PERMISSIONS } from '@/shared/auth';

// Mock Keycloak service
jest.mock('@/shared/auth/keycloakService', () => ({
  keycloakService: {
    hasPermission: jest.fn(),
    hasRole: jest.fn(),
    // other methods...
  }
}));

describe('PermissionGuard', () => {
  it('renders children when user has permission', async () => {
    // Setup mock implementation
    keycloakService.hasPermission.mockResolvedValue(true);
    
    render(
      <AuthProvider>
        <PermissionGuard permission={PERMISSIONS.PHARMACY.CREATE}>
          <div data-testid="protected-content">Protected Content</div>
        </PermissionGuard>
      </AuthProvider>
    );
    
    // Wait for async permission check
    const content = await screen.findByTestId('protected-content');
    expect(content).toBeInTheDocument();
  });
  
  it('renders fallback when user lacks permission', async () => {
    // Setup mock implementation
    keycloakService.hasPermission.mockResolvedValue(false);
    
    render(
      <AuthProvider>
        <PermissionGuard 
          permission={PERMISSIONS.PHARMACY.CREATE}
          fallback={<div data-testid="fallback-content">Access Denied</div>}
        >
          <div data-testid="protected-content">Protected Content</div>
        </PermissionGuard>
      </AuthProvider>
    );
    
    // Wait for async permission check
    const fallback = await screen.findByTestId('fallback-content');
    expect(fallback).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
```

### Backend Testing

Test method security with Spring Security test helpers:

```java
@WebMvcTest(PharmacyController.class)
@Import(SecurityConfig.class)
public class PharmacyControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private PharmacyService pharmacyService;
    
    @Test
    @WithMockUser(authorities = "view:pharmacy")
    public void getAllPharmacies_WithViewPermission_ReturnsPharmacies() throws Exception {
        // Given
        when(pharmacyService.getAllPharmacies()).thenReturn(List.of(new PharmacyDTO()));
        
        // When/Then
        mockMvc.perform(get("/api/pharmacies"))
               .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(authorities = "wrong:permission")
    public void getAllPharmacies_WithoutViewPermission_ReturnsForbidden() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/pharmacies"))
               .andExpect(status().isForbidden());
    }
    
    @Test
    @WithMockUser(authorities = "create:pharmacy")
    public void createPharmacy_WithCreatePermission_ReturnsCreated() throws Exception {
        // Given
        PharmacyRequest request = new PharmacyRequest();
        request.setName("Test Pharmacy");
        
        when(pharmacyService.createPharmacy(any())).thenReturn(new PharmacyDTO());
        
        // When/Then
        mockMvc.perform(post("/api/pharmacies")
               .contentType(MediaType.APPLICATION_JSON)
               .content(new ObjectMapper().writeValueAsString(request)))
               .andExpect(status().isCreated());
    }
}
```

## Common Patterns

### Feature Flag with Permissions

Combine feature flags with permissions:

```tsx
import { usePermission, PERMISSIONS } from '@/shared/auth';
import { useFeatureFlag } from '@/shared/features';

const NewFeatureComponent = () => {
  const { canAccess } = usePermission(PERMISSIONS.PHARMACY.CREATE);
  const { isEnabled: betaFeaturesEnabled } = useFeatureFlag('BETA_FEATURES');
  
  const showNewFeature = canAccess && betaFeaturesEnabled;
  
  return (
    <div>
      {showNewFeature && <NewFeatureUI />}
    </div>
  );
};
```

### Contextual Permissions

Handle permissions based on data context:

```tsx
import { usePermission, PERMISSIONS } from '@/shared/auth';

const PharmacyActions = ({ pharmacy }) => {
  const { canAccess: canEdit } = usePermission(PERMISSIONS.PHARMACY.EDIT);
  const { canAccess: canManage } = usePermission(PERMISSIONS.PHARMACY.MANAGE);
  const { user } = useAuth();
  
  // Contextual permission - user can edit their own pharmacies
  const isOwner = pharmacy.ownerId === user?.id;
  const canEditThisPharmacy = canEdit || (isOwner && pharmacy.status !== 'APPROVED');
  
  return (
    <div>
      <Button 
        disabled={!canEditThisPharmacy}
        onClick={() => editPharmacy(pharmacy.id)}
      >
        Edit
      </Button>
      
      {canManage && pharmacy.status === 'PENDING' && (
        <Button onClick={() => approvePharmacy(pharmacy.id)}>
          Approve
        </Button>
      )}
    </div>
  );
};
```

### Permission Inheritance

Leverage role inheritance for cleaner code:

```tsx
import { RoleGuard } from '@/shared/auth';

// Since ADMIN inherits from MANAGER, this will allow both roles
const ManagementArea = () => {
  return (
    <RoleGuard role="MANAGER">
      <h1>Management Dashboard</h1>
      <ManagementTools />
      
      {/* No need for extra guards - role inheritance handles this */}
      <AdminOnlySection />
    </RoleGuard>
  );
};

// This component internally checks for ADMIN role
const AdminOnlySection = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');
  
  return isAdmin ? <AdminTools /> : null;
};
```

## Best Practices

### 1. Use Constants for Permissions

Always use the centralized permission constants:

```typescript
// CORRECT
import { PERMISSIONS } from '@/shared/auth';
const hasAccess = await hasPermission(PERMISSIONS.PHARMACY.CREATE);

// INCORRECT - avoid hardcoded strings
const hasAccess = await hasPermission('create:pharmacy');
```

### 2. Follow Principle of Least Privilege

Start with minimal permissions and add as needed:

```typescript
// Incorrect: Using broader permission than needed
<PermissionGuard permission={PERMISSIONS.PHARMACY.MANAGE}>
  <ViewPharmacyDetails pharmacyId={id} />
</PermissionGuard>

// Correct: Using specific permission
<PermissionGuard permission={PERMISSIONS.PHARMACY.VIEW}>
  <ViewPharmacyDetails pharmacyId={id} />
</PermissionGuard>
```

### 3. Graceful Degradation

Provide fallbacks and partial functionality:

```tsx
<PermissionGuard 
  permission={PERMISSIONS.REPORTS.MANAGE}
  fallback={
    <PermissionGuard 
      permission={PERMISSIONS.REPORTS.VIEW}
      fallback={<AccessDeniedMessage feature="reports" />}
    >
      <ReadOnlyReports />
    </PermissionGuard>
  }
>
  <FullReportDashboard />
</PermissionGuard>
```

### 4. Permission Documentation

Document permissions in component JSDocs:

```tsx
/**
 * Pharmacy management component
 * 
 * Required permissions:
 * - PERMISSIONS.PHARMACY.VIEW (base functionality)
 * - PERMISSIONS.PHARMACY.EDIT (to modify pharmacy details)
 * - PERMISSIONS.PHARMACY.DELETE (to remove pharmacies)
 */
const PharmacyManagement = () => {
  // Implementation
};
```

### 5. Error Handling

Provide clear feedback for permission errors:

```tsx
const PharmacyActions = () => {
  const { hasPermission } = useAuth();
  
  const handleDelete = async (id) => {
    try {
      await deletePharmacy(id);
    } catch (error) {
      if (error.code === 'PERMISSION_DENIED') {
        toast.error(
          "You don't have permission to delete this pharmacy. " +
          "Please contact your administrator if you need this access."
        );
      } else {
        toast.error("Failed to delete pharmacy");
      }
    }
  };
  
  // Implementation
};
```

## Troubleshooting

### Permission Not Working

If permission checks aren't working as expected:

1. **Verify Token Content**:
   ```typescript
   // Debug token content
   const token = localStorage.getItem('pharmacyhub_access_token');
   const decoded = JSON.parse(atob(token.split('.')[1]));
   console.log('Token permissions:', decoded.permissions);
   console.log('Token roles:', decoded.roles);
   ```

2. **Check Keycloak Configuration**:
   - Ensure role attributes contain the correct permissions
   - Verify protocol mappers are configured correctly
   - Check that token includes permissions claim

3. **Permission Guard Debugging**:
   ```typescript
   <PermissionGuard
     permission={PERMISSIONS.PHARMACY.CREATE}
     fallback={<div>Missing Permission: {PERMISSIONS.PHARMACY.CREATE}</div>}
   >
     <CreatePharmacyForm />
   </PermissionGuard>
   ```

### Role Inheritance Issues

If role inheritance doesn't work as expected:

1. **Verify Keycloak Role Composition**:
   - Check composite roles in Keycloak admin console
   - Ensure parent roles properly include child roles

2. **Test Individual Roles**:
   ```typescript
   // Test each role individually
   const { hasRole } = useAuth();
   const isAdmin = await hasRole('ADMIN');
   const isManager = await hasRole('MANAGER');
   console.log({ isAdmin, isManager });
   ```

### Token Refresh Problems

If users are unexpectedly logged out:

1. **Monitor Token Expiration**:
   ```typescript
   // Debug token expiration
   const expiry = localStorage.getItem('pharmacyhub_token_expiry');
   const remainingTime = parseInt(expiry) - Date.now();
   console.log('Token expires in:', remainingTime / 1000, 'seconds');
   ```

2. **Check Refresh Logic**:
   - Ensure refresh token is properly stored
   - Verify refresh token hasn't expired
   - Check network requests for token refresh calls

### Backend Permission Denial

If backend denies access unexpectedly:

1. **Inspect Request Headers**:
   - Verify Authorization header is correctly formatted
   - Check that token is not expired or malformed

2. **Review Spring Security Logs**:
   - Enable debug logging for Spring Security
   - Look for access denied reasons in logs

3. **Test with Direct API Calls**:
   ```bash
   # Test API directly with token
   curl -H "Authorization: Bearer $TOKEN" http://localhost:8081/api/pharmacies
   ```
