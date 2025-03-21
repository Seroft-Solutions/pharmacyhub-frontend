# Manual Payment Flow

This feature enables users to pay for premium exams using manual JazzCash payments, with admin approval flow.

## Features

- Users can submit manual payment details for premium exams
- Admins can review, approve, or reject payment requests
- Approved users get access to premium exams
- Payment status tracking for users
- Prevents duplicate submission of payment requests
- RBAC-controlled admin dashboard

## User Flow

1. User selects a premium exam and clicks "Purchase Access"
2. User is directed to a manual payment form with JazzCash instructions
3. User submits payment details (sender number, transaction ID, notes)
4. System saves the submission as a pending payment request
5. User sees payment status (Pending, Approved, Rejected)
6. If approved, user gains access to the premium exam
7. If rejected, user can submit a new payment request

## Admin Flow

1. Admin navigates to Manual Payments dashboard
2. Admin can view all payment requests or filter by status
3. Admin reviews pending payment requests
4. Admin approves or rejects each request with optional notes
5. Approved requests grant users access to the premium exams

## Components

### Backend

- `PaymentManualRequest`: Entity for storing manual payment requests
- `PaymentManualRequestRepository`: Repository for database operations
- `PaymentManualService`: Service for business logic
- `PaymentManualController`: REST API endpoints

### Frontend

- `ManualPaymentForm`: Form for users to submit payment details
- `ManualPaymentStatus`: Shows payment status to users
- `ManualPaymentsAdminDashboard`: Admin dashboard for approving/rejecting payments
- `usePremiumExam`: Hook to check exam access including manual payments
- `PremiumExamGuard`: Component to guard premium exam access
- `ExamPurchaseFlow`: Updated to support manual payments

## API Endpoints

### User Endpoints

- `POST /api/v1/payments/manual/request`: Submit payment request
- `GET /api/v1/payments/manual/requests`: Get user's requests
- `GET /api/v1/payments/manual/exams/:examId/access`: Check exam access
- `GET /api/v1/payments/manual/exams/:examId/pending`: Check pending request

### Admin Endpoints

- `GET /api/v1/payments/manual/admin/requests`: Get all requests
- `GET /api/v1/payments/manual/admin/requests/status/:status`: Filter by status
- `POST /api/v1/payments/manual/admin/requests/:requestId/approve`: Approve request
- `POST /api/v1/payments/manual/admin/requests/:requestId/reject`: Reject request

## Pages

- `/dashboard/payments/manual/:examId`: Submit payment form
- `/dashboard/payments/pending`: View payment status
- `/admin/payments/manual`: Admin dashboard

## Permissions

- `payments:manage-manual`: Required for admin dashboard access

## Database Schema

```
payment_manual_requests
  id (PK)
  user_id
  exam_id
  sender_number
  transaction_id
  notes
  attachment_url
  status (PENDING, APPROVED, REJECTED)
  created_at
  processed_at
  admin_notes
```