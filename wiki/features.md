# PharmacyHub Features Documentation

## Licensing Feature

### Components Structure

```
/features/licensing/
├── ui/
│   ├── forms/
│   │   ├── PharmacistForm.tsx
│   │   ├── PharmacyManagerForm.tsx
│   │   ├── ProprietorForm.tsx
│   │   └── SalesmanForm.tsx
│   ├── pages/
│   │   ├── connections/
│   │   └── requests/
│   ├── pharmacist/
│   ├── pharmacy-manager/
│   ├── proprietor/
│   └── salesman/
├── model/
│   ├── types.ts
│   └── constants.ts
├── api/
│   └── services/
└── lib/
    └── utils/
```

### Key Features

1. **User Registration**
    - Pharmacist registration
    - Pharmacy Manager registration
    - Proprietor registration
    - Salesman registration

2. **Connection Management**
    - Connection requests
    - Connection approvals
    - Connection listings
    - Request notifications

3. **License Management**
    - License application
    - License renewal
    - License verification
    - Status tracking

## Exam Feature

### Components Structure

```
/features/exams/
├── ui/
│   ├── quiz/
│   ├── mock-test/
│   └── results/
├── model/
│   ├── types.ts
│   └── constants.ts
├── api/
│   └── services/
└── lib/
    └── utils/
```

### Key Features

1. **Practice Tests**
    - MCQ questions
    - Topic-wise practice
    - Progress tracking
    - Score history

2. **Mock Exams**
    - Timed tests
    - Real exam simulation
    - Result analysis
    - Performance metrics

3. **Learning Resources**
    - Study materials
    - Reference guides
    - Practice tips
    - Exam preparation strategies

## Authentication Feature

### Components Structure

```
/features/auth/
├── ui/
│   ├── login/
│   ├── register/
│   └── reset-password/
├── model/
│   └── types.ts
├── api/
│   └── services/
└── lib/
    └── hooks/
```

### Key Features

1. **User Authentication**
    - JWT-based auth
    - OAuth2 integration
    - Session management
    - Secure token storage

2. **Authorization**
    - Role-based access
    - Permission management
    - Protected routes
    - API security

3. **Account Management**
    - Profile updates
    - Password reset
    - Email verification
    - Account recovery