# RBAC API Integration Guide

This guide explains how to integrate the RBAC system with your Spring Boot backend API.

## Overview

The RBAC system for the Exams-Preparation feature communicates with your Spring Boot backend to check permissions and roles. This guide explains the expected API endpoints and payloads.

## API Endpoints

### Permission Checks

#### Check Permission

Checks if the current user has permission for a specific operation.

```
POST /api/rbac/check-permission
```

**Request:**
```json
{
  "operation": "VIEW_EXAMS",
  "context": {
    "examId": "123",
    "userId": "456"
  }
}
```

**Response:**
```json
{
  "hasPermission": true
}
```

#### Check Role

Checks if the current user has a specific role.

```
POST /api/rbac/check-role
```

**Request:**
```json
{
  "role": "admin"
}
```

**Response:**
```json
{
  "hasRole": true
}
```

### User Information

#### Get User Roles

Gets all roles for the current user.

```
GET /api/rbac/user-roles
```

**Response:**
```json
{
  "roles": ["admin", "instructor"]
}
```

#### Get User Permissions

Gets all permissions for the current user.

```
GET /api/rbac/user-permissions
```

**Response:**
```json
{
  "permissions": [
    "exam:view", 
    "exam:create", 
    "exam:edit", 
    "exam:delete"
  ]
}
```

### Exam-Specific Endpoints

#### Check Exam Access

Checks if the user can access a specific exam for the given operation.

```
POST /api/exams/check-access
```

**Request:**
```json
{
  "examId": "123",
  "operation": "EDIT_EXAM"
}
```

**Response:**
```json
{
  "hasAccess": true
}
```

## Implementing the Backend

### Spring Boot Controller Example

```java
@RestController
@RequestMapping("/api/rbac")
public class RbacController {

    private final RbacService rbacService;

    public RbacController(RbacService rbacService) {
        this.rbacService = rbacService;
    }

    @PostMapping("/check-permission")
    public Map<String, Boolean> checkPermission(@RequestBody PermissionCheckRequest request) {
        boolean hasPermission = rbacService.checkPermission(
            request.getOperation(),
            request.getContext()
        );
        
        return Map.of("hasPermission", hasPermission);
    }

    @PostMapping("/check-role")
    public Map<String, Boolean> checkRole(@RequestBody RoleCheckRequest request) {
        boolean hasRole = rbacService.checkRole(request.getRole());
        return Map.of("hasRole", hasRole);
    }

    @GetMapping("/user-roles")
    public Map<String, List<String>> getUserRoles() {
        List<String> roles = rbacService.getUserRoles();
        return Map.of("roles", roles);
    }

    @GetMapping("/user-permissions")
    public Map<String, List<String>> getUserPermissions() {
        List<String> permissions = rbacService.getUserPermissions();
        return Map.of("permissions", permissions);
    }
}

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping("/check-access")
    public Map<String, Boolean> checkExamAccess(@RequestBody ExamAccessRequest request) {
        boolean hasAccess = examService.checkExamAccess(
            request.getExamId(),
            request.getOperation()
        );
        
        return Map.of("hasAccess", hasAccess);
    }
}
```

### Model Classes

```java
public class PermissionCheckRequest {
    private String operation;
    private Map<String, Object> context;
    
    // Getters and setters
}

public class RoleCheckRequest {
    private String role;
    
    // Getters and setters
}

public class ExamAccessRequest {
    private String examId;
    private String operation;
    
    // Getters and setters
}
```

### Service Implementation

```java
@Service
public class RbacService {

    private final UserService userService;
    private final PermissionRepository permissionRepository;

    public RbacService(UserService userService, PermissionRepository permissionRepository) {
        this.userService = userService;
        this.permissionRepository = permissionRepository;
    }

    public boolean checkPermission(String operation, Map<String, Object> context) {
        // Get current user
        User currentUser = userService.getCurrentUser();
        
        // Check if user is admin (admins have all permissions)
        if (currentUser.hasRole("admin")) {
            return true;
        }
        
        // Map operation to actual permission(s)
        List<String> permissions = mapOperationToPermissions(operation);
        
        // Check if user has all required permissions
        return permissions.stream()
            .allMatch(permission -> 
                permissionRepository.hasPermission(currentUser.getId(), permission, context)
            );
    }

    public boolean checkRole(String role) {
        User currentUser = userService.getCurrentUser();
        return currentUser.hasRole(role);
    }

    public List<String> getUserRoles() {
        User currentUser = userService.getCurrentUser();
        return currentUser.getRoles();
    }

    public List<String> getUserPermissions() {
        User currentUser = userService.getCurrentUser();
        return permissionRepository.getPermissionsForUser(currentUser.getId());
    }

    private List<String> mapOperationToPermissions(String operation) {
        // Map frontend operations to actual permission strings
        // This should match your frontend OperationPermissionMap
        switch (operation) {
            case "VIEW_EXAMS":
                return List.of("exam:view");
            case "EDIT_EXAM":
                return List.of("exam:edit");
            case "DELETE_EXAM":
                return List.of("exam:delete");
            // Add other operations
            default:
                return List.of();
        }
    }
}

@Service
public class ExamService {

    private final UserService userService;
    private final ExamRepository examRepository;
    private final RbacService rbacService;

    public ExamService(UserService userService, ExamRepository examRepository, RbacService rbacService) {
        this.userService = userService;
        this.examRepository = examRepository;
        this.rbacService = rbacService;
    }

    public boolean checkExamAccess(String examId, String operation) {
        // Get current user
        User currentUser = userService.getCurrentUser();
        
        // Check if user is admin (admins have access to all exams)
        if (currentUser.hasRole("admin")) {
            return true;
        }
        
        // Get the exam
        Exam exam = examRepository.findById(examId)
            .orElseThrow(() -> new EntityNotFoundException("Exam not found"));
        
        // Check exam-specific access rules
        switch (operation) {
            case "VIEW_EXAM_DETAILS":
                return exam.isPublished() || exam.getCreator().equals(currentUser);
            case "EDIT_EXAM":
                return exam.getCreator().equals(currentUser);
            case "DELETE_EXAM":
                return exam.getCreator().equals(currentUser);
            // Add other operations
            default:
                // Fall back to general permission check
                return rbacService.checkPermission(operation, Map.of("examId", examId));
        }
    }
}
```

## Error Handling

The frontend RBAC system handles errors by falling back to denying access. Make sure your backend API handles errors gracefully and returns appropriate HTTP status codes:

- 200 OK: Permission check succeeded
- 401 Unauthorized: User is not authenticated
- 403 Forbidden: User does not have the required permission
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error

## Security Considerations

### Authentication

All RBAC endpoints should be protected by authentication. The API client should include the authentication token in the request header.

### Request Context Validation

Validate the context data provided in permission check requests. For example, when checking permission for a specific exam, validate that the exam ID is valid.

### Caching

Consider caching permission check results to improve performance, but make sure to invalidate the cache when permissions change.

## Conclusion

This guide provides a starting point for integrating the frontend RBAC system with your Spring Boot backend. Adapt the API endpoints and implementation to fit your specific needs and security requirements.
