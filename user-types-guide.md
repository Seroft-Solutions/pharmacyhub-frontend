# PharmacyHub User Types Implementation Guide

This guide explains the implementation for creating different user types in the PharmacyHub application, including Super Admin, Admin, and Demo users.

## Implementation Overview

We've implemented a directory-based approach to manage different user types through a clear hierarchy of Groups, Roles, and Permissions:

```
Groups (SuperAdmins, Administrators, DemoUsers)
  ↓
Roles (SUPER_ADMIN, ADMIN, USER)
  ↓
Permissions (Fine-grained access controls)
```

## Directory Structure

The implementation is organized in the following directory structure:

```
com.pharmacyhub.security.users/
  ├── factory/
  │   └── UserTypeFactory.java       # Factory for creating different user types
  ├── initializer/
  │   └── DefaultUsersInitializer.java  # Initialize default users
  ├── groups/
  │   └── GroupSeeder.java           # Configure and seed user groups
  ├── service/
  │   └── UserTypeService.java       # Service for user type operations
  ├── controller/
  │   └── UserManagementController.java # REST endpoints
  ├── dto/
  │   └── UserCreationRequest.java   # DTO for creation requests
  ├── util/
  │   ├── UserConverter.java         # Utility for conversions
  │   └── UserCreator.java           # Fluent interface for creation
  └── README.md                      # Documentation
```

## User Types

### Super Admin
- Has complete system access
- Can manage all users, roles, and permissions
- Belongs to the SuperAdmins group
- Default credentials: superadmin@pharmacyhub.com / superadmin123

### Admin
- Has administrative access but not system-level settings
- Can manage day-to-day operations
- Belongs to the Administrators group
- Default credentials: admin@pharmacyhub.com / admin123

### Demo User
- Has limited read-only access 
- Used for demonstration and testing
- Belongs to the DemoUsers group
- Default credentials: demo@pharmacyhub.com / demo123

## How to Create Users

The implementation provides multiple ways to create users:

### Method 1: Using UserTypeService

```java
@Autowired
private UserTypeService userTypeService;

// Create a super admin
User superAdmin = userTypeService.createSuperAdmin(
    "super.admin@example.com", 
    "Super", 
    "Admin", 
    "password123", 
    "1234567890"  // Contact number (optional)
);
```

### Method 2: Using Fluent UserCreator (Recommended)

```java
@Autowired
private UserCreator userCreator;

// Create a super admin with fluent interface
User superAdmin = userCreator.superAdmin()
    .withEmail("super.admin@example.com")
    .withFirstName("Super")
    .withLastName("Admin")
    .withPassword("password123")
    .withContactNumber("1234567890")
    .build();
```

### Method 3: Using REST API

You can also create users through the REST API:

```
POST /api/users/super-admins
{
  "email": "super.admin@example.com",
  "firstName": "Super",
  "lastName": "Admin",
  "password": "password123",
  "contactNumber": "1234567890"
}
```

## Configuration

Default user credentials can be configured in `application.properties` or `application.yml`:

```properties
# Super Admin credentials
pharmacyhub.superadmin.email=superadmin@pharmacyhub.com
pharmacyhub.superadmin.password=superadmin123

# Admin credentials
pharmacyhub.admin.email=admin@pharmacyhub.com
pharmacyhub.admin.password=admin123

# Demo user credentials
pharmacyhub.demo.email=demo@pharmacyhub.com
pharmacyhub.demo.password=demo123
```

## Detailed Documentation

For more detailed information, see the README file in the `com.pharmacyhub.security.users` package.