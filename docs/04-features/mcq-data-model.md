# MCQ Practice Platform Data Model

## Overview

This document outlines the recommended data model for the MCQ Practice Platform, designed for scalability, performance, and maintainability.

## JSON Schema

```typescript
interface MCQPaper {
  id: string;                 // Unique identifier for the paper
  type: 'model' | 'past';     // Paper type
  year?: number;              // Year for past papers
  version: string;            // Content version for tracking updates
  title: string;             // Paper title
  description: string;       // Brief description
  timeLimit: number;         // Time limit in minutes
  totalQuestions: number;    // Total number of questions
  passingCriteria: {
    minimumQuestions: number; // Minimum questions required
    passingScore: number;    // Minimum score required
  };
  sections: MCQSection[];    // Organized sections of questions
  metadata: {
    createdAt: string;      // ISO date string
    updatedAt: string;      // ISO date string
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];         // Search and filter tags
    category: string;       // Main category
    subCategory?: string;   // Optional sub-category
  };
}

interface MCQSection {
  id: string;               // Section identifier
  title: string;           // Section title
  description?: string;    // Optional section description
  questions: MCQuestion[]; // Questions in this section
}

interface MCQuestion {
  id: string;              // Unique question identifier
  questionNumber: number;  // Sequential number in paper
  question: string;       // Question text
  options: {
    [key: string]: string; // A, B, C, D mapped to option text
  };
  answer: string;         // Correct answer (e.g., "D")
  explanation: string;    // Detailed answer explanation
  metadata: {
    difficulty: 'easy' | 'medium' | 'hard';
    topic: string;        // Specific topic
    subTopic?: string;    // Optional sub-topic
    tags: string[];       // Question-specific tags
    source?: string;      // Reference source
    lastUpdated: string;  // ISO date string
  };
  stats?: {              // Optional performance statistics
    attemptCount: number;
    correctCount: number;
    averageTimeSpent: number;
  };
}
```

## Example Implementation

```json
{
  "id": "model-paper-1",
  "type": "model",
  "version": "1.0.0",
  "title": "Pharmacy Practice Model Paper 1",
  "description": "Comprehensive model paper covering pharmacy laws and regulations",
  "timeLimit": 70,
  "totalQuestions": 100,
  "passingCriteria": {
    "minimumQuestions": 25,
    "passingScore": 50
  },
  "sections": [
    {
      "id": "sec-1",
      "title": "Drug Laws and Regulations",
      "questions": [
        {
          "id": "q-001",
          "questionNumber": 1,
          "question": "\"Spurious drug\" means a drug that:",
          "options": {
            "A": "Purports to be a drug but does not contain the active ingredient",
            "B": "Purports to be the product of a manufacturer, place, or country of which it is not truly a product",
            "C": "Is imported or exported for sale under a particular name while actually being another drug",
            "D": "All of the above"
          },
          "answer": "D",
          "explanation": "A spurious drug includes those that lack the claimed active ingredient, falsely claim a different origin, or are misrepresented for sale. Each statement (A, B, and C) contributes to the legal definition of a spurious drug.",
          "metadata": {
            "difficulty": "medium",
            "topic": "Drug Laws",
            "subTopic": "Drug Classifications",
            "tags": ["spurious drugs", "regulations", "drug safety"],
            "lastUpdated": "2024-02-21T00:00:00Z"
          }
        }
      ]
    }
  ],
  "metadata": {
    "createdAt": "2024-02-21T00:00:00Z",
    "updatedAt": "2024-02-21T00:00:00Z",
    "difficulty": "medium",
    "tags": ["pharmacy law", "regulations", "practice exam"],
    "category": "Pharmacy Practice",
    "subCategory": "Laws and Regulations"
  }
}
```

## Benefits of This Structure

1. **Organized Content**
   - Questions grouped into logical sections
   - Clear metadata for filtering and search
   - Version control for content updates

2. **Enhanced Features**
   - Support for difficulty levels
   - Topic-based organization
   - Detailed statistics tracking
   - Flexible tagging system

3. **Performance Optimization**
   - Structured data for efficient querying
   - Segregated sections for lazy loading
   - Metadata for caching strategies

4. **Analytics Support**
   - Question-level statistics
   - Performance tracking
   - Usage patterns analysis

5. **Content Management**
   - Easy content updates
   - Version tracking
   - Source attribution

## Implementation Guidelines

1. **Storage**
   - Use MongoDB or PostgreSQL JSON fields for flexible schema
   - Implement content versioning
   - Set up efficient indexing on frequently queried fields

2. **API Design**
   ```typescript
   // API Endpoints
   GET /api/papers                    // List all papers with filtering
   GET /api/papers/:id               // Get specific paper
   GET /api/papers/:id/questions     // Get questions (paginated)
   POST /api/papers/:id/submit       // Submit answers
   GET /api/papers/:id/statistics    // Get performance statistics
   ```

3. **Caching Strategy**
   - Cache full papers at CDN level
   - Implement stale-while-revalidate for content updates
   - Use Redis for user progress and session data

4. **Frontend Considerations**
   - Implement progressive loading for questions
   - Cache user answers in localStorage
   - Optimize rendering for large question sets

## Migration Strategy

For existing MCQ data:

1. Create a migration script to transform current format
2. Add missing metadata fields with default values
3. Generate unique IDs for all entities
4. Validate data integrity after migration

## Next Steps

1. Set up automated validation for JSON schema
2. Implement content management system
3. Create API endpoints following RESTful practices
4. Develop frontend components for rendering questions
5. Set up monitoring for content usage and performance