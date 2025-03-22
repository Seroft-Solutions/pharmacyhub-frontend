# Premium Exam Guards

## Overview

This directory contains components related to premium exam access control in the PharmacyHub application.

## Components

### `PremiumExamGuard`

A critical security component that protects premium content from unauthorized access.

#### Features:

- **Dual Access Checks**: Verifies both universal premium access and specific exam access
- **Redirect Capability**: Can redirect users to payment page if they lack access
- **Flexible Content Display**: Shows either children, fallback content, or restricted access message
- **Loading States**: Properly handles loading states during access checks

#### Usage:

```jsx
<PremiumExamGuard examId={examId} redirectIfNotPaid={true}>
  {/* Premium content goes here */}
  <ExamContainer examId={examId} />
</PremiumExamGuard>
```

#### Props:

- `examId` (number, required): The ID of the exam to check access for
- `children` (ReactNode, required): The content to display if access is granted
- `redirectIfNotPaid` (boolean, default: true): Whether to redirect to payment page if access is denied
- `fallback` (ReactNode, optional): Custom content to display if access is denied

## Implementation Guidelines

1. **Mandatory Protection**: This guard MUST be used for all routes that serve premium content.

2. **Key Routes to Protect**:
   - `/exam/[id]`
   - `/exam/results/[attemptId]`
   - Any other route exposing premium content

3. **Integration with Access Control System**:
   - Uses `usePremiumStatus` hook for universal premium access
   - Uses `usePremiumExam` hook for specific exam access

4. **Security Considerations**:
   - Frontend protection is not enough - backend API must also verify permissions
   - PremiumExamGuard helps prevent accidental access but backend validation is critical

## Notes on Backend Integration

This guard works with backend permission checks to provide a comprehensive access control system:

- Frontend: PremiumExamGuard prevents UI access to premium content
- Backend: API endpoints verify permissions before serving protected content

Both layers must be implemented correctly for the system to be secure.
