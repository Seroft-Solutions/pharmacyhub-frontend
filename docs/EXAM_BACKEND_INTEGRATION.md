# PharmacyHub Exam Feature - Backend Integration Guide

## Overview

This document explains how the exam feature in the PharmacyHub frontend is integrated with the backend API. The integration follows RESTful principles and uses token-based authentication.

## API Endpoints

### Exam Management

| HTTP Method | Endpoint                                   | Purpose                                    | Auth Required |
|-------------|--------------------------------------------|--------------------------------------------|---------------|
| GET         | `/api/v1/exams`                           | Get all exams (admin/instructor only)      | Yes           |
| GET         | `/api/v1/exams/published`                 | Get all published exams                    | No            |
| GET         | `/api/v1/exams/{id}`                      | Get exam by ID                             | Conditional   |
| GET         | `/api/v1/exams/status/{status}`           | Get exams by status                        | Yes           |
| POST        | `/api/v1/exams`                           | Create a new exam                          | Yes           |
| PUT         | `/api/v1/exams/{id}`                      | Update an existing exam                    | Yes           |
| DELETE      | `/api/v1/exams/{id}`                      | Delete an exam                             | Yes           |
| POST        | `/api/v1/exams/{id}/publish`              | Publish an exam                            | Yes           |
| POST        | `/api/v1/exams/{id}/archive`              | Archive an exam                            | Yes           |

### Exam Taking

| HTTP Method | Endpoint                                        | Purpose                                 | Auth Required |
|-------------|------------------------------------------------|-----------------------------------------|---------------|
| POST        | `/api/v1/exams/{id}/start`                     | Start an exam attempt                   | Yes           |
| GET         | `/api/v1/exams/attempts/user`                  | Get current user's exam attempts        | Yes           |
| GET         | `/api/v1/exams/{examId}/attempts`              | Get attempts for a specific exam        | Yes           |
| GET         | `/api/v1/exams/attempts/{id}`                  | Get a specific attempt                  | Yes           |
| POST        | `/api/v1/exams/attempts/{id}/submit`           | Submit exam answers                     | Yes           |
| POST        | `/api/v1/exams/attempts/{id}/answer/{qId}`     | Answer a question                       | Yes           |
| POST        | `/api/v1/exams/attempts/{id}/flag/{qId}`       | Flag a question                         | Yes           |
| DELETE      | `/api/v1/exams/attempts/{id}/flag/{qId}`       | Unflag a question                       | Yes           |
| GET         | `/api/v1/exams/attempts/{id}/flags`            | Get flagged questions for an attempt    | Yes           |

## Authentication

All API endpoints that require authentication expect a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is obtained from the authentication endpoints and stored in local storage. The application automatically includes the token in API requests using the `tokenManager` and TanStack Query API.

## Data Models

### Exam

```typescript
interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  questions?: Question[];
}
```

### Question

```typescript
interface Question {
  id: number;
  questionNumber: number;
  text: string;
  options: Option[];
  explanation?: string;
  marks: number;
}
```

### Exam Attempt

```typescript
interface ExamAttempt {
  id: number;
  examId: number;
  userId: string;
  startTime: string;
  endTime?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  answers?: UserAnswer[];
}
```

### User Answer

```typescript
interface UserAnswer {
  questionId: number;
  selectedOptionId: string;
  timeSpent?: number; // in seconds
}
```

## Integration Implementation

The integration is implemented through:

1. **API Endpoints**: Defined in `examService.ts`
2. **Query Hooks**: Implemented in `useExamApi.ts`
3. **Zustand Store**: For client-side state management
4. **Session Hook**: `useExamSession.ts` ties everything together

### API Integration Approach

The frontend uses TanStack Query for data fetching and mutations, providing:

- Automatic caching and refetching
- Loading and error states
- Optimistic updates
- Request deduplication

### Authentication Flow

1. When making authenticated requests, the frontend automatically includes the JWT token from the tokenManager
2. If the token is expired, the frontend attempts to refresh it
3. If the refresh fails, the user is redirected to the login page

### Error Handling

The frontend handles various error cases:

- Network errors: Displayed with retry options
- Authentication errors: User redirected to login
- Validation errors: Shown to the user with clear messages
- Server errors: Gracefully handled with user-friendly messages

## Testing

The integration can be tested using:

1. **Manual Testing**: Following the exam workflow
2. **Mock Data**: Using the sample data when no backend is available
3. **Integration Tests**: With mock API responses

## Troubleshooting

Common issues:

1. **401 Unauthorized**: Check if the token is valid and not expired
2. **404 Not Found**: Ensure the API endpoints match the backend paths
3. **400 Bad Request**: Validate request payload against backend expectations

## References

- [PharmacyHub Backend API Documentation](/docs/EXAM_API.md)
- [TanStack Query Documentation](https://tanstack.com/query)
- [JWT Authentication Guide](/docs/authentication.md)
