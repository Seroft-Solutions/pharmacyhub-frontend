# Manual Payment Flow Test Plan

This document outlines the test cases for the Manual Payment Flow feature to ensure it works correctly.

## Backend Tests

### Entity and Repository Tests
- [ ] Test that `PaymentManualRequest` entity can be created with all required fields
- [ ] Test that repository methods correctly fetch requests by user, exam, and status
- [ ] Test that repository prevents duplicate requests for the same exam/user
- [ ] Test that status enum works correctly with PENDING, APPROVED, and REJECTED states

### Service Tests
- [ ] Test `submitRequest` method prevents duplicate submissions
- [ ] Test `approveRequest` method correctly updates request status
- [ ] Test `rejectRequest` method correctly updates request status
- [ ] Test access check methods (`hasUserPendingRequest`, `hasUserApprovedRequest`)
- [ ] Test that all DTOs are correctly mapped

### Controller Tests
- [ ] Test that all endpoints return correct status codes
- [ ] Test that security annotations prevent unauthorized access
- [ ] Test that error handling works correctly

## Frontend Tests

### API Hook Tests
- [ ] Test that `useSubmitManualPayment` correctly calls the API
- [ ] Test that `useCheckManualExamAccess` returns correct access status
- [ ] Test that `useCheckPendingManualRequest` detects pending requests
- [ ] Test that admin hooks work correctly with proper permissions

### Component Tests
- [ ] Test that `ManualPaymentForm` validates all required fields
- [ ] Test that `ManualPaymentStatus` displays correct status information
- [ ] Test that `ManualPaymentsAdminDashboard` filters requests by status
- [ ] Test that `PremiumExamGuard` correctly blocks/allows access to premium exams
- [ ] Test that `ExamPurchaseFlow` redirects to the correct pages based on status

### Page Tests
- [ ] Test that manual payment form page shows JazzCash instructions
- [ ] Test that payment status page correctly displays status and allows navigation
- [ ] Test that admin dashboard page enforces RBAC permissions

## Integration Tests

### User Flow Tests
- [ ] Test complete user journey from exam selection to payment submission
- [ ] Test that after payment approval, user can access the premium exam
- [ ] Test that after payment rejection, user can submit a new request
- [ ] Test that user can view payment status while pending

### Admin Flow Tests
- [ ] Test that admin can view all payment requests
- [ ] Test that admin can filter requests by status
- [ ] Test that admin can approve a payment with notes
- [ ] Test that admin can reject a payment with notes
- [ ] Test that approved/rejected requests are immediately reflected in user access

## Performance and Edge Cases

### Performance Tests
- [ ] Test loading time of admin dashboard with large number of requests
- [ ] Test API response times for status checks

### Edge Cases
- [ ] Test handling of concurrent submissions for the same exam
- [ ] Test behavior when an exam is deleted but has payment requests
- [ ] Test with very long transaction IDs or notes
- [ ] Test when admin notes exceed maximum length

## Security Tests

- [ ] Test that users cannot access admin endpoints
- [ ] Test that users cannot view other users' payment requests
- [ ] Test that users cannot approve their own requests
- [ ] Test CSRF protection on form submissions
- [ ] Test that sensitive payment data is properly handled

## Deployment Checklist

- [ ] Ensure database migration scripts are correct
- [ ] Add necessary RBAC permissions to production roles
- [ ] Update navigation menus to include payment links
- [ ] Verify correct integration with existing payment system
- [ ] Create monitoring for payment approval times
- [ ] Document the feature for end users and administrators