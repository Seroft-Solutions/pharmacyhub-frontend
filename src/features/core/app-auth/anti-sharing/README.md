# Anti-Sharing Protection Feature

This feature prevents multiple people from abusing a single PharmacyHub account through shared credentials by enforcing intelligent login and device/session validation.

## Key Components

### Core Functionality
- Device ID generation and management (`deviceManager.ts`)
- Session state management (`antiSharingStore.ts`)
- Login validation logic (`useSessionValidation.ts`)

### API Integration
- Session API services (`sessionApi.ts`)
- TanStack Query hooks (`sessionApiHooks.ts`)

### UI Components
- OTP challenge dialog (`OTPChallenge.tsx`)
- Login validation error dialog (`LoginValidationError.tsx`)
- Admin monitoring interfaces (`admin/SessionMonitoring.tsx`)

## How It Works

1. **Device Identification**:
   - A unique device ID is generated on first login and stored in localStorage
   - This device ID is included with each login request

2. **Login Validation**:
   - Backend validates the login attempt based on device ID, IP address, and login history
   - If validation fails, appropriate error is shown and user is challenged to verify identity

3. **Session Management**:
   - Each login creates a session record with device ID, IP address, and user agent
   - Suspicious activity is flagged for admin review

4. **Admin Controls**:
   - Admins can view and filter all login sessions
   - Actions include terminating sessions and requiring OTP verification

## Integration Points

- Enhanced login form with device ID and validation
- OTP verification flow
- Admin monitoring interface at `/admin/session-monitoring`
- Integration with existing authentication flow

## Backend Requirements

The frontend expects the following backend endpoints:
- `POST /api/v1/sessions/validate`: Validate login attempts
- `GET /api/v1/sessions/users/:id`: Get sessions for a user
- `GET /api/v1/sessions`: Get all sessions (admin only)
- `DELETE /api/v1/sessions/:id`: Terminate a session
- `POST /api/v1/sessions/users/:id/terminate-others`: Terminate all other sessions for a user
- `POST /api/v1/sessions/users/:id/require-otp`: Require OTP verification for a user
