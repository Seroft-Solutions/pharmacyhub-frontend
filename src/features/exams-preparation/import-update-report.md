# External Import Update Report

This report identifies files that import from the old `exams` feature and need to be updated to import from the new `exams-preparation` feature.

## src\app\(dashboard)\payments\manual\[examId]

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/api/hooks/useExamHooks';
// New: import { ... } from '@/features/exams-preparation/api/hooks/useExamHooks';

```

## src\app\(exams)\exam\[id]

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/components/ExamContainer';
// New: import { ... } from '@/features/exams-preparation/components/ExamContainer';

// Old: import { ... } from '@/features/exams/api/UseExamApi';
// New: import { ... } from '@/features/exams-preparation/api/UseExamApi';

// Old: import { ... } from '@/features/exams/components/common/ExamTimer';
// New: import { ... } from '@/features/exams-preparation/components/common/ExamTimer';

// Old: import { ... } from '@/features/exams/components/student/QuestionNavigation';
// New: import { ... } from '@/features/exams-preparation/components/student/QuestionNavigation';

```

## src\app\(exams)\exam\dashboard

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/api/UseExamApi';
// New: import { ... } from '@/features/exams-preparation/api/UseExamApi';

```

## src\app\(exams)\exam\model-papers

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/api';
// New: import { ... } from '@/features/exams-preparation/api';

// Old: import { ... } from '@/features/exams/components/ExamPaperCard';
// New: import { ... } from '@/features/exams-preparation/components/ExamPaperCard';

// Old: import { ... } from '@/features/exams/types/StandardTypes';
// New: import { ... } from '@/features/exams-preparation/types/StandardTypes';

```

## src\app\(exams)\exam\past-papers

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/api';
// New: import { ... } from '@/features/exams-preparation/api';

// Old: import { ... } from '@/features/exams/components/ExamPaperCard';
// New: import { ... } from '@/features/exams-preparation/components/ExamPaperCard';

// Old: import { ... } from '@/features/exams/types/StandardTypes';
// New: import { ... } from '@/features/exams-preparation/types/StandardTypes';

```

## src\app\(exams)\exam\practice

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/model/standardTypes';
// New: import { ... } from '@/features/exams-preparation/model/standardTypes';

// Old: import { ... } from '@/features/exams/components/ExamPaperCard';
// New: import { ... } from '@/features/exams-preparation/components/ExamPaperCard';

```

## src\app\(exams)\exam\results

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/utils/formatTime';
// New: import { ... } from '@/features/exams-preparation/utils/formatTime';

// Old: import { ... } from '@/features/exams/model/standardTypes';
// New: import { ... } from '@/features/exams-preparation/model/standardTypes';

```

## src\app\(exams)\exam\results\[attemptId]

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/components/results/ExamResults';
// New: import { ... } from '@/features/exams-preparation/components/results/ExamResults';

// Old: import { ... } from '@/features/exams/components/review/ExamReview';
// New: import { ... } from '@/features/exams-preparation/components/review/ExamReview';

```

## src\app\(exams)\exam\review\[id]

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/components/review/ReviewMode';
// New: import { ... } from '@/features/exams-preparation/components/review/ReviewMode';

// Old: import { ... } from '@/features/exams/store/examStore';
// New: import { ... } from '@/features/exams-preparation/store/examStore';

```

## src\app\(exams)\exam\subject-papers

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/api';
// New: import { ... } from '@/features/exams-preparation/api';

// Old: import { ... } from '@/features/exams/components/ExamPaperCard';
// New: import { ... } from '@/features/exams-preparation/components/ExamPaperCard';

// Old: import { ... } from '@/features/exams/types/StandardTypes';
// New: import { ... } from '@/features/exams-preparation/types/StandardTypes';

// Old: import { ... } from '@/features/exams/components/common/SubjectCard';
// New: import { ... } from '@/features/exams-preparation/components/common/SubjectCard';

// Old: import { ... } from '@/features/exams/utils/subject';
// New: import { ... } from '@/features/exams-preparation/utils/subject';

```

## src\app\(exams)\payment\process

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/api/services/examApiService';
// New: import { ... } from '@/features/exams-preparation/api/services/examApiService';

```

## src\app\(exams)\payment\result

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/api/services/examApiService';
// New: import { ... } from '@/features/exams-preparation/api/services/examApiService';

```

## src\app\admin\exams

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/components/admin';
// New: import { ... } from '@/features/exams-preparation/components/admin';

// Old: import { ... } from '@/features/exams/components/admin/ExamsList';
// New: import { ... } from '@/features/exams-preparation/components/admin/ExamsList';

```

## src\app\admin\exams\[examId]\edit

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/components/admin';
// New: import { ... } from '@/features/exams-preparation/components/admin';

// Old: import { ... } from '@/features/exams/rbac';
// New: import { ... } from '@/features/exams-preparation/rbac';

```

## src\app\admin\exams\[examId]\questions

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/components/admin';
// New: import { ... } from '@/features/exams-preparation/components/admin';

// Old: import { ... } from '@/features/exams/rbac';
// New: import { ... } from '@/features/exams-preparation/rbac';

```

## src\app\admin\exams\manage

### page.tsx

```typescript
// Old: import { ... } from '@/features/exams/components/admin';
// New: import { ... } from '@/features/exams-preparation/components/admin';

```

## src\features\dashboard\api

### mockBackend.ts

```typescript
// Old: import { ... } from '@/features/exams/progress/api/progressApi';
// New: import { ... } from '@/features/exams-preparation/progress/api/progressApi';

```

## src\features\dashboard\api\hooks

### useDashboardApi.ts

```typescript
// Old: import { ... } from '@/features/exams/progress/api/progressApi';
// New: import { ... } from '@/features/exams-preparation/progress/api/progressApi';

```

### useDashboardData.ts

```typescript
// Old: import { ... } from '@/features/exams/api/hooks/useExamApiHooks';
// New: import { ... } from '@/features/exams-preparation/api/hooks/useExamApiHooks';

// Old: import { ... } from '@/features/exams/api/hooks/useExamPaperHooks';
// New: import { ... } from '@/features/exams-preparation/api/hooks/useExamPaperHooks';

```

## src\features\dashboard\api\services

### dashboardService.ts

```typescript
// Old: import { ... } from '@/features/exams/progress/api/progressApi';
// New: import { ... } from '@/features/exams-preparation/progress/api/progressApi';

```

## src\features\payments\components

### ExamPurchaseFlow.tsx

```typescript
// Old: import { ... } from '@/features/exams/types/StandardTypes';
// New: import { ... } from '@/features/exams-preparation/types/StandardTypes';

```

### PaperPricingManager.tsx

```typescript
// Old: import { ... } from '@/features/exams/hooks/useExams';
// New: import { ... } from '@/features/exams-preparation/hooks/useExams';

// Old: import { ... } from '@/features/exams/rbac';
// New: import { ... } from '@/features/exams-preparation/rbac';

```

### PremiumExamCard.tsx

```typescript
// Old: import { ... } from '@/features/exams/types/StandardTypes';
// New: import { ... } from '@/features/exams-preparation/types/StandardTypes';

```

## src\features\payments\manual\components

### ManualPaymentForm.tsx

```typescript
// Old: import { ... } from '@/features/exams/types/StandardTypes';
// New: import { ... } from '@/features/exams-preparation/types/StandardTypes';

```

## Summary

Total files to update: 24

These files should be updated to reference the new exams-preparation feature instead of the old exams feature.
