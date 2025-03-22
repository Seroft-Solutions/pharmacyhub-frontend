# Premium Access Control System

## Overview

This directory contains the key components for the "pay once, access all" premium access control system. The system is designed to provide a consistent way to check and enforce premium access across the application.

## Key Components

### 1. `usePremiumStatus` Hook

The central hook for checking premium access status. It implements the "pay once, access all" concept by checking:

- Local storage for premium status (for quick access after initial check)
- Manual payment approvals
- Online payment history

Always use this hook when checking for premium access to ensure consistent behavior.

### 2. `ExamPurchaseFlow` Component

The UI component that controls access to premium exams:

- Shows "Start Paper" button if the exam is not premium or user has access
- Shows "Purchase Access" button if the exam is premium and user doesn't have access
- Handles loading states and user feedback

### 3. `PremiumExamGuard` Component

A protective wrapper that prevents unauthorized access to premium content:

- Checks both universal premium access and specific exam access
- Shows a loading indicator while checking access
- Displays restricted access message if user doesn't have access
- Redirects to payment page if specified

## Implementation Guidelines

1. **Always use `ExamPurchaseFlow` for premium buttons**
   - Don't implement custom buttons for premium access
   - This ensures consistent behavior and UX

2. **Protect premium routes with `PremiumExamGuard`**
   - All premium content routes must be wrapped with this guard
   - Prevents direct URL access to premium content

3. **Consistent premium status checking**
   - Use `usePremiumStatus` for checking universal premium access
   - Use `usePremiumExam` for checking specific exam access

4. **Proper property mapping**
   - Ensure `premium` and `purchased` properties are correctly converted to boolean

## Example Usage

### Using ExamPurchaseFlow:

```jsx
<ExamPurchaseFlow
  exam={paper}
  onStart={() => handleStartExam(paper.id)}
/>
```

### Protecting Premium Routes:

```jsx
<PremiumExamGuard examId={examId}>
  <ExamContainer
    examId={examId}
    userId={userId}
    onExit={handleExit}
  />
</PremiumExamGuard>
```

### Checking Premium Status:

```jsx
const { isPremium, isLoading } = usePremiumStatus();
if (isPremium) {
  // User has universal premium access
}
```

## Troubleshooting

If premium badges or access controls aren't working correctly:

1. Check the data from API responses - ensure `premium` and `purchased` properties exist
2. Verify boolean conversion - use `Boolean(value)` to ensure proper type conversion
3. Confirm PremiumExamGuard is applied to all premium content routes
4. Check that localStorage persistence is working correctly
