# Exams Preparation Feature

This feature module allows users to create, take, and manage exams with support for premium content via payment integration. It has been implemented following the "Feature-First Organization" principle and "Core as Foundation" approach.

## Architecture

The exams-preparation feature follows these architectural principles:

### Feature-First Organization
- Self-contained with its own UI, logic, and data access
- No direct dependencies on other features
- Clearly defined public API through index exports

### Core as Foundation
- Leverages core modules rather than duplicating functionality
- Follows established patterns for consistency
- Extends core functionality only when necessary

### Modular Component Design
- Components follow atomic design principles:
  - Atoms: Basic UI elements
  - Molecules: Composite components
  - Organisms: Page-level components
  - Templates: Layout structures
- No component exceeds 200 lines
- Each component has a single responsibility

### State Management Hierarchy
- TanStack Query for server state (via core API module)
- Zustand for complex client state
- React Context for simple UI state

## Feature Structure

```
/features/exams-preparation/
  /api            - API integration
  /components     - UI components organized by atomic design
    /atoms        - Basic UI elements
    /molecules    - Composite components
    /organisms    - Page sections and complex components
    /templates    - Page layouts
    /guards       - Access control components
    /admin        - Admin-specific components
    /navigation   - Navigation components
  /hooks          - Feature-specific hooks
  /payments       - Payment integration
  /rbac           - Role-based access control
  /state          - State management
    /stores       - Zustand stores
    /contexts     - React contexts
  /types          - TypeScript types
    /models       - Domain models
    /dtos         - Data transfer objects
    /props        - Component props
    /state        - State types
    /api          - API types
    /utils        - Utility types
  /utils          - Utility functions
  index.ts        - Public API
```

## Core Module Integration

The feature leverages these core modules:

- **Core API**: For data fetching and server state management
- **Core UI**: For basic UI components and design patterns
- **Core Auth**: For authentication and user management
- **Core RBAC**: For role-based access control
- **Core Utils**: For common utility functions
- **Core State**: For state management with Zustand

Detailed documentation on core integration:
- [Core Integration Guide](./docs/CORE_INTEGRATION_GUIDE.md) - Overview of core integration
- [Component Design Guide](./docs/COMPONENT_DESIGN.md) - UI component integration
- [Core API Integration](./docs/CORE_API_INTEGRATION.md) - API integration
- [State Management](./docs/STATE_MANAGEMENT.md) - State management
- [Auth & RBAC Integration](./docs/AUTH_RBAC_INTEGRATION.md) - Auth and RBAC

## Main Components

### State Management

#### Store Factory

A reusable factory for creating Zustand stores with consistent patterns:

```typescript
import { createStore } from '@/features/exams-preparation/state';

const myStore = createStore(
  'storeName',
  { /* initial state */ },
  (set, get) => ({
    // actions
  }),
  { /* options */ }
);
```

#### Context Factory

A factory for creating React contexts with consistent patterns:

```typescript
import { createContextProvider } from '@/features/exams-preparation/state';

const [MyProvider, useMyContext] = createContextProvider(
  'contextName',
  { /* initial state */ },
  (setState) => ({
    // actions
  })
);
```

#### Exam Editor Store

Manages the state for creating and editing exams:

```typescript
import { 
  useExam, 
  useQuestions, 
  useCurrentQuestion,
  examEditorStore 
} from '@/features/exams-preparation/state';

// Access state with optimized selectors
const exam = useExam();
const questions = useQuestions();
const currentQuestion = useCurrentQuestion();

// Access actions
const { addQuestion, updateQuestion } = examEditorStore.getState();
```

#### Exam Attempt Store

Manages the state for taking exams:

```typescript
import {
  useCurrentQuestion,
  useProgress,
  useAnswer,
  examAttemptStore
} from '@/features/exams-preparation/state';

// Access state
const currentQuestion = useCurrentQuestion();
const progress = useProgress();
const answer = useAnswer(questionId);

// Access actions
const { setAnswer, nextQuestion, submitExam } = examAttemptStore.getState();
```

#### Filter Context

Manages filters for exam listings:

```typescript
import { useExamFilter, ExamFilterProvider } from '@/features/exams-preparation/state';

// Provide context
<ExamFilterProvider>
  <MyComponent />
</ExamFilterProvider>

// Use context
const { status, search, setFilter, clearFilters } = useExamFilter();
```

#### Session Context

Manages exam session state including timers:

```typescript
import { useExamSession, ExamTimerProvider } from '@/features/exams-preparation/state';

// Provide context
<ExamTimerProvider initialTime={1800} onTimeExpired={handleTimeUp}>
  <MyComponent />
</ExamTimerProvider>

// Use context
const { remainingTime, isTimerActive, startTimer, pauseTimer } = useExamSession();
```

## Type System

The feature includes a comprehensive type system:

- **Domain Models**: `Exam`, `Question`, `ExamAttempt`, etc.
- **DTOs**: For API communication
- **Component Props**: Following atomic design principles
- **State Types**: For Zustand stores and Context providers
- **API Types**: For query hooks and API clients
- **Utility Types**: Helpers and type guards

## Usage Examples

### Creating an Exam

```tsx
import { examEditorStore } from '@/features/exams-preparation/state';
import { ExamEditor } from '@/features/exams-preparation/components/organisms';

// In a component
<ExamEditor />

// Programmatically
const { addQuestion, updateExam } = examEditorStore.getState();
updateExam({ title: 'New Exam' });
addQuestion();
```

### Taking an Exam

```tsx
import { examAttemptStore } from '@/features/exams-preparation/state';
import { ExamAttemptScreen } from '@/features/exams-preparation/components/organisms';

// In a component
<ExamAttemptScreen examId={123} />

// Programmatically
const { startExam, setAnswer, submitExam } = examAttemptStore.getState();
await startExam(123);
setAnswer(questionId, { selectedOptions: ['optionA'] });
await submitExam();
```

## Core Module Extension Candidates

The following utilities could be promoted to core:

- **Store Factory**: For consistent Zustand store creation
- **Context Factory**: For consistent React context creation
- **Selector Optimization**: For performance optimized component rendering

## Contributors

- Development Team

## License

Internal use only
