# Guards

This directory contains components that protect routes and content based on authorization, authentication, or feature access rules.

## What to place here

- Route protection components
- Access control components
- Feature-specific guards

## Examples

- ExamGuard - General authorization for exam content
- PremiumExamGuard - Protection for premium content that requires payment

## Guidelines

- Guards should focus on access control logic
- Guards should integrate with core auth/rbac modules
- Guards should provide clear feedback when access is denied
- Guards can redirect users or show alternative content
- Consider using higher-order components for reusable guard logic
