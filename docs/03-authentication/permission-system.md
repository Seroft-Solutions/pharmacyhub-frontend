# PharmacyHub Permission System

## Overview

The PharmacyHub permission system provides a centralized, type-safe approach to access control. It integrates with Keycloak to enforce a hierarchical permission model across both frontend and backend components.

## Table of Contents

1. [Design Principles](#design-principles)
2. [Permission Structure](#permission-structure)
3. [Hierarchical Model](#hierarchical-model)
4. [Implementation Details](#implementation-details)
5. [Usage Examples](#usage-examples)
6. [Security Considerations](#security-considerations)
7. [Maintenance Guidelines](#maintenance-guidelines)

## Design Principles

The permission system follows these core principles:

1. **Single Source of Truth**: All permissions are defined in one central location
2. **Type Safety**: TypeScript ensures compile-time validation of permission strings
3. **Hierarchical Organization**: Permissions follow a logical group > role > permission hierarchy
4. **Separation of Concerns**: Authentication logic is separate from permission logic
5. **Scalability**: Easy to add new permissions without changing existing code
6. **Maintainability**: Clear organization making future modifications straightforward

## Permission Structure

### Permission Format

Permissions follow a `domain:action` format:
- `domain` - The resource or feature area (e.g., `pharmacy`, `user`, `exam`)
- `action` - The specific operation (e.g., `create`, `view`, `manage`)

Examples:
- `pharmacy:create` - Permission to create new pharmacies
- `users:manage` - Permission to manage user accounts
- `inventory:view` - Permission to view inventory items

### Permission Categories

Permissions are organized into logical categories:

```typescript
export const PERMISSIONS = {
  // System-level permissions
  SYSTEM: {
    MANAGE: 'manage:system',
    AUDIT: 'audit:system',
    SECURITY: 'manage:security',
  },
  
  // User management permissions
  USER: {
    MANAGE: 'manage:users',
    VIEW: 'view:users',
    PROFILE: 'manage:profile',
  },
  
  // Role management permissions
  ROLE: {
    MANAGE: 'manage:roles',
  },
  
  // Pharmacy-related permissions
  PHARMACY: {
    CREATE: 'create:pharmacy',
    EDIT: 'edit:pharmacy',
    DELETE: 'delete:pharmacy',
    VIEW: 'view:pharmacy',
    APPROVE: 'approve:pharmacy',
    OWN: 'own:pharmacy',
    MANAGE: 'manage:pharmacy',
  },
  
  // ... additional categories ...
}
```

## Hierarchical Model

### Groups > Roles > Permissions

The system follows a three-level hierarchy:

1. **Groups** contain users with similar functions
   - Example: `/Pharmacy Staff/Pharmacists`

2. **Roles** define sets of responsibilities
   - Example: `PHARMACIST`

3. **Permissions** grant specific actions
   - Example: `create:pharmacy`

### Role Inheritance

Roles can inherit permissions from other roles:

```
SUPER_ADMIN
 └── ADMIN
      └── MANAGER
           └── USER
```

In this example:
- `SUPER_ADMIN` inherits all permissions from `ADMIN`
- `ADMIN` inherits all permissions from `MANAGER`
- `MANAGER` inherits all permissions from `USER`

### Permission Mapping

Roles map to specific permission sets:

```typescript
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    ...Object.values(PERMISSIONS.SYSTEM),
    ...Object.values(PERMISSIONS.USER),
    // ...
  ],
  
  ADMIN: [
    PERMISSIONS.USER.MANAGE,
    PERMISSIONS.USER.VIEW,
    PERMISSIONS.ROLE.MANAGE,
    // ...
  ],
  
  // ... additional role mappings ...
}
```

### User Type Mapping

User types map to roles and permissions:

```typescript
export const USER_TYPE_PERMISSIONS = {
  PHARMACIST: ROLE_PERMISSIONS.PHARMACIST,
  PROPRIETOR: ROLE_PERMISSIONS.PROPRIETOR,
  // ... additional user types ...
}
```

## Implementation Details

### Central Permission File

The centralized permission definitions are in `src/shared/auth/permissions.ts`:

```typescript
// Permissions
export const PERMISSIONS = { ... };

// Role to permission mapping
export const ROLE_PERMISSIONS = { ... };

// User type to permission mapping
export const USER_TYPE_PERMISSIONS = { ... };

// Group paths
export const GROUP_PATHS = { ... };

// Helper types for type safety
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]];
export type Role = keyof typeof ROLE_PERMISSIONS;
export type UserType = keyof typeof USER_TYPE_PERMISSIONS;
export type GroupPath = typeof GROUP_PATHS[keyof typeof GROUP_PATHS];
```

### Keycloak Integration

Permissions are stored in Keycloak:

1. **Role Attributes**: Roles contain permission arrays
   ```json
   {
     "name": "PHARMACIST",
     "attributes": {
       "permissions": [
         "create:pharmacy",
         "edit:pharmacy",
         "view:pharmacy",
         "manage:inventory",
         "take:exams",
         "view:certification"
       ]
     }
   }
   ```

2. **Group Attributes**: Groups inherit permissions
   ```json
   {
     "name": "Pharmacists",
     "path": "/Pharmacy Staff/Pharmacists",
     "attributes": {
       "permissions": [
         "create:pharmacy",
         "edit:pharmacy",
         "view:pharmacy",
         "manage:inventory",
         "take:exams",
         "view:certification"
       ]
     },
     "realmRoles": ["PHARMACIST"]
   }
   ```

3. **Token Claims**: Permissions are included in tokens
   ```json
   {
     "sub": "user-123",
     "roles": ["PHARMACIST"],
     "permissions": [
       "create:pharmacy",
       "edit:pharmacy",
       "view:pharmacy",
       "manage:inventory",
       "take:exams",
       "view:certification"
     ],
     "groups": ["/Pharmacy Staff/Pharmacists"]
   }
   ```

### Permission Checking

Authentication context provides permission checking:

```typescript
const { hasPermission, hasRole } = useAuth();

// Check single permission
const canCreatePharmacy = await hasPermission(PERMISSIONS.PHARMACY.CREATE);

// Check role
const isPharmacist = await hasRole('PHARMACIST');
```

### Guard Components

React components for conditional rendering:

```typescript
// Single permission guard
<PermissionGuard 
  permission={PERMISSIONS.PHARMACY.CREATE}
  fallback={<AccessDeniedMessage />}
>
  <CreatePharmacyForm />
</PermissionGuard>

// Multiple permission guard (any)
<AnyPermissionGuard
  permissions={[PERMISSIONS.PHARMACY.EDIT, PERMISSIONS.PHARMACY.OWN]}
  fallback={<AccessDeniedMessage />}
>
  <EditPharmacyForm />
</AnyPermissionGuard>

// Role guard
<RoleGuard
  role="ADMIN"
  fallback={<AccessDeniedMessage />}
>
  <AdminDashboard />
</RoleGuard>
```

## Usage Examples

### Frontend Components

```tsx
import { 
  PermissionGuard, 
  PERMISSIONS 
} from '@/shared/auth';

// Dashboard.tsx
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Only visible to pharmacy creators */}
      <PermissionGuard permission={PERMISSIONS.PHARMACY.CREATE}>
        <section>
          <h2>Create New Pharmacy</h2>
          <CreatePharmacyButton />
        </section>
      </PermissionGuard>
      
      {/* Only visible to inventory managers */}
      <PermissionGuard permission={PERMISSIONS.INVENTORY.MANAGE}>
        <section>
          <h2>Inventory Management</h2>
          <InventoryManagementPanel />
        </section>
      </PermissionGuard>
    </div>
  );
}
```

### Custom Hooks

```tsx
import { usePermission, PERMISSIONS } from '@/shared/auth';

// PharmacyActions.tsx
export default function PharmacyActions({ pharmacyId }) {
  const { canAccess: canEdit } = usePermission(PERMISSIONS.PHARMACY.EDIT);
  const { canAccess: canDelete } = usePermission(PERMISSIONS.PHARMACY.DELETE);
  
  return (
    <div className="actions">
      {canEdit && (
        <button onClick={() => editPharmacy(pharmacyId)}>
          Edit
        </button>
      )}
      
      {canDelete && (
        <button onClick={() => deletePharmacy(pharmacyId)}>
          Delete
        </button>
      )}
    </div>
  );
}
```

### Backend Integration

Spring Security configuration:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .oauth2ResourceServer(oauth2 -> oauth2.jwt())
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/pharmacies/create").hasAuthority("create:pharmacy")
                .requestMatchers("/api/pharmacies/*/edit").hasAuthority("edit:pharmacy")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // ...
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

## Security Considerations

### Token-Based Permission Verification

Permission claims in JWTs must be verified:

1. **Frontend**: Permissions are extracted from tokens and cached
2. **Backend**: JWT signature is verified before trusting permission claims
3. **Refresh**: Permissions are updated when tokens are refreshed

### Permission Elevation Prevention

Measures to prevent permission elevation:

1. **Read-only Permission Lists**: Permission constants are immutable
2. **Server-side Verification**: Backend independently verifies permissions
3. **Token Signing**: Keycloak signs tokens to prevent tampering

### Least Privilege Principle

The system enforces least privilege:

1. **Default User Role**: New users get minimal permissions
2. **Explicit Grants**: Permissions must be explicitly assigned
3. **Fine-grained Control**: Permissions are specific rather than broad

## Maintenance Guidelines

### Adding New Permissions

To add a new permission:

1. Add the permission to the `PERMISSIONS` object in appropriate category
2. Update `ROLE_PERMISSIONS` mappings for affected roles
3. Update Keycloak realm configuration with new permission
4. Deploy updated realm configuration

Example:
```typescript
// Adding a new permission
PERMISSIONS.PHARMACY.TRANSFER = 'transfer:pharmacy';

// Updating role mappings
ROLE_PERMISSIONS.ADMIN.push(PERMISSIONS.PHARMACY.TRANSFER);
ROLE_PERMISSIONS.MANAGER.push(PERMISSIONS.PHARMACY.TRANSFER);
```

### Adding New Roles

To add a new role:

1. Add role to `ROLE_PERMISSIONS` with appropriate permissions
2. Update Keycloak realm configuration with new role
3. Create appropriate groups if needed
4. Update registration flow if needed

Example:
```typescript
// Adding a new role
ROLE_PERMISSIONS.AUDITOR = [
  PERMISSIONS.PHARMACY.VIEW,
  PERMISSIONS.REPORTS.VIEW,
  PERMISSIONS.SYSTEM.AUDIT
];

// Adding group path
GROUP_PATHS.AUDITOR = '/System Administration/Auditors';
```

### Permission Auditing

Regular permission auditing should:

1. Verify permission consistency between code and Keycloak
2. Review permission assignments for appropriateness
3. Check for unused or redundant permissions
4. Ensure new features have proper permission checks

### Evolution Strategy

As the application evolves:

1. Prefer adding new permissions over modifying existing ones
2. Use permission categories to keep organization clean
3. Document permission changes in version control
4. Run security reviews when permission structure changes
