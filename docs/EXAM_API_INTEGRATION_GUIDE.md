# Exam API Integration Guide

This guide outlines how to integrate with the updated Exam API endpoints. The backend has been refactored to resolve recursion issues in API responses, making it easier to integrate with the frontend.

## API Endpoints

### Exam Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|--------------|
| `/api/v1/exams` | GET | Get all exams | Yes (ADMIN, INSTRUCTOR) |
| `/api/v1/exams/published` | GET | Get published exams | No |
| `/api/v1/exams/{id}` | GET | Get exam by ID | Yes |
| `/api/v1/exams` | POST | Create new exam | Yes (ADMIN, INSTRUCTOR) |
| `/api/v1/exams/{id}` | PUT | Update existing exam | Yes (ADMIN, INSTRUCTOR) |
| `/api/v1/exams/{id}` | DELETE | Delete exam | Yes (ADMIN) |
| `/api/v1/exams/status/{status}` | GET | Get exams by status | Yes (ADMIN, INSTRUCTOR) |
| `/api/v1/exams/{id}/publish` | POST | Publish exam | Yes (ADMIN, INSTRUCTOR) |
| `/api/v1/exams/{id}/archive` | POST | Archive exam | Yes (ADMIN, INSTRUCTOR) |

### Exam Paper Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|--------------|
| `/api/exams/papers` | GET | Get all exam papers | Yes |
| `/api/exams/papers/model` | GET | Get model papers | Yes |
| `/api/exams/papers/past` | GET | Get past papers | Yes |
| `/api/exams/papers/{id}` | GET | Get paper by ID | Yes |
| `/api/exams/papers/stats` | GET | Get exam statistics | Yes |
| `/api/exams/papers` | POST | Create new paper | Yes |
| `/api/exams/papers/{id}` | PUT | Update existing paper | Yes |
| `/api/exams/papers/{id}` | DELETE | Delete paper | Yes |

## Response Formats

### Exam DTO (With Full Question Details)

```json
{
  "id": 1,
  "title": "Introduction to Pharmacy",
  "description": "Basic concepts in pharmacy practice",
  "duration": 60,
  "totalMarks": 100,
  "passingMarks": 60,
  "status": "PUBLISHED",
  "questions": [
    {
      "id": 1,
      "questionNumber": 1,
      "questionText": "What is the primary role of a pharmacist?",
      "options": [
        {
          "id": 1,
          "optionKey": "A",
          "optionText": "Dispensing medication",
          "isCorrect": true
        },
        {
          "id": 2,
          "optionKey": "B",
          "optionText": "Performing surgery",
          "isCorrect": false
        },
        {
          "id": 3,
          "optionKey": "C",
          "optionText": "Diagnosing diseases",
          "isCorrect": false
        },
        {
          "id": 4,
          "optionKey": "D",
          "optionText": "Developing marketing strategies",
          "isCorrect": false
        }
      ],
      "correctAnswer": "A",
      "explanation": "The primary role of a pharmacist is dispensing medication and ensuring medication safety.",
      "marks": 5
    }
    // More questions...
  ]
}
```

### Exam Paper DTO

```json
{
  "id": 1,
  "title": "Pharmacy Fundamentals",
  "description": "Test your knowledge of pharmacy basics",
  "difficulty": "medium",
  "questionCount": 30,
  "durationMinutes": 45,
  "tags": ["pharmacology", "basics", "introduction"],
  "premium": false,
  "attemptCount": 156,
  "successRatePercent": 75.5,
  "lastUpdatedDate": "2024-02-15",
  "type": "MODEL",
  "examId": 1
}
```

## Frontend Integration Steps

### 1. Update API Service Integrations

The existing `examService.ts` should be updated to align with the new API response structures:

```typescript
// Ensure the adapter correctly maps backend fields to frontend model
export function adaptBackendExam(backendExam: BackendExam): Exam {
  return {
    id: backendExam.id,
    title: backendExam.title,
    description: backendExam.description,
    duration: backendExam.duration,
    maxScore: backendExam.totalMarks,
    passingScore: backendExam.passingMarks,
    status: mapBackendStatus(backendExam.status),
    createdAt: backendExam.createdAt,
    updatedAt: backendExam.updatedAt,
    questionCount: backendExam.questionCount // New field
  };
}
```

### 2. Authentication Handling

The API integrates with the authentication system. Ensure your API calls include the proper authorization headers:

```typescript
const token = tokenManager.getToken();
const response = await apiClient.get<BackendExam[]>(`${BASE_PATH}/published`, {
  requiresAuth: token !== null,
  headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
});
```

### 3. Error Handling

Implement proper error handling for API responses:

```typescript
try {
  const exams = await examService.getPublishedExams();
  setExams(exams);
  setLoading(false);
} catch (error) {
  setError('Failed to load exams. Please try again later.');
  setLoading(false);
  console.error('Error fetching exams:', error);
}
```

### 4. Data Loading Strategies

Consider implementing these patterns for loading exam data:

- **Pagination**: For listing large numbers of exams
- **Caching**: For frequently accessed data
- **Optimistic Updates**: For a better user experience during edits
- **Lazy Loading**: For questions and detailed content

## Common Integration Issues

### 1. Authentication Failures

If you encounter 403 errors:
- Check that tokens are correctly stored and refreshed
- Verify user roles match endpoint requirements
- Ensure token is included in request headers

### 2. Data Type Mismatches

Common type issues:
- Status enums (ensure casing matches: "PUBLISHED" vs "published")
- Date formats (backend uses ISO format)
- Numeric fields that might be strings in responses

### 3. Nested Data Access

When working with relationships:
- ExamPaper only contains examId, not the full exam object
- Question data must be loaded in a separate request

## Testing Your Integration

1. **Auth Testing**: Test both authenticated and anonymous access
2. **CRUD Operations**: Verify create, read, update, delete functionality
3. **Status Transitions**: Test exam status changes (draft → published → archived)
4. **Error Handling**: Verify your UI gracefully handles API errors
5. **Loading States**: Test loading indicators during API requests

## Conclusion

This updated API provides a more consistent and reliable way to integrate the exams feature. The refactored backend eliminates recursion issues that previously caused serialization problems, making the API more robust and easier to work with.

If you encounter any issues with the integration, please refer to the full API documentation or contact the backend team for assistance.
