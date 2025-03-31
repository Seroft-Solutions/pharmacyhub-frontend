# PHAR-380: Exams Feature State Management Analysis

This document provides a comprehensive analysis of the current state management implementation in the exams-preparation feature, identifies inconsistencies, and proposes refactoring strategies to align with architecture principles.

## 1. Current State Management Inventory

### 1.1 Zustand Stores

The exams-preparation feature contains 4 Zustand stores with the following purposes:

| Store Name | File Path | Purpose | State Size | Action Count |
|------------|-----------|---------|------------|--------------|
| `examStore` | `/state/stores/examStore.ts` | Manages the state for exam execution including active exam sessions, answers, and quiz navigation | Large (13 state properties) | 25 actions |
| `examEditorStore` | `/state/stores/examEditorStore.ts` | Manages exam creation and editing state | Large (10+ state properties) | 15+ actions |
| `examAttemptStore` | `/state/stores/examAttemptStore.ts` | Tracks student attempts at exams | Medium | 12+ actions |
| `examPreparationStore` | `/state/stores/examPreparationStore.ts` | Manages overall feature state | Medium | 10 actions |

### 1.2 React Context Providers

The feature uses 4 React Context providers for UI-specific state:

| Context Name | File Path | Purpose | Usage |
|--------------|-----------|---------|-------|
| `ExamFilterContext` | `/state/contexts/ExamFilterContext.tsx` | Manages filter state in exam listings | UI Filtering |
| `ExamSessionContext` | `/state/contexts/ExamSessionContext.tsx` | Manages active exam session information | Session information sharing |
| `QuestionContext` | `/state/contexts/QuestionContext.tsx` | Provides question data to nested components | Question UI components |
| `TimerContext` | `/state/contexts/TimerContext.tsx` | Manages exam timer state | Timer UI components |

### 1.3 Factory Utilities

The feature includes two factory utilities for state management:

| Utility | File Path | Purpose | Status |
|---------|-----------|---------|--------|
| `storeFactory.ts` | `/state/storeFactory.ts` | Creates Zustand stores with consistent patterns | **DEPRECATED** - Already promoted to core |
| `contextFactory.ts` | `/state/contextFactory.ts` | Creates React context providers with consistent patterns | Candidate for promotion to core |

## 2. Key Findings

### 2.1 Inconsistencies

1. **Factory Usage**: The feature is still using its own `storeFactory.ts` even though it has been promoted to core. Some stores have started using the core version, but others have not.

2. **Store Size**: Some stores are too large and manage too many concerns, violating the single responsibility principle.

3. **Selector Pattern**: Inconsistent use of selector patterns across stores. Some use `createSelector` while others don't.

4. **Persistence Strategy**: Inconsistent approach to persistence with some stores using custom persistence logic.

5. **State Shape**: Inconsistent state shape across stores with some stores mixing UI state with data state.

### 2.2 Appropriate Use Assessment

| Store/Context | Appropriate? | Reasoning |
|---------------|--------------|-----------|
| `examStore` | ✅ | Complex state with multiple interactions and performance needs |
| `examEditorStore` | ✅ | Complex form state with validation and user interactions |
| `examAttemptStore` | ✅ | Needs persistence and complex state transitions |
| `examPreparationStore` | ❌ | Overlaps with other stores; better split into smaller concerns |
| `ExamFilterContext` | ✅ | Simple UI state with limited updates - good Context candidate |
| `ExamSessionContext` | ⚠️ | Contains some state that might be better in a Zustand store |
| `QuestionContext` | ✅ | Appropriate for sharing question UI state to child components |
| `TimerContext` | ⚠️ | Frequently updating state could cause performance issues with Context |

### 2.3 Performance Implications

1. **Timer Context**: The `TimerContext` updates every second, which could cause unnecessary rerenders throughout the component tree.

2. **Large Component Trees**: The exams feature has deep component hierarchies, making Context usage for frequently changing state potentially problematic.

3. **Selector Optimization**: Inconsistent use of selectors in Zustand stores leads to potential performance issues with unnecessary rerenders.

4. **Store Size**: Large stores with many actions can impact bundle size and lead to unnecessary rerenders.

### 2.4 Global vs. Local State Analysis

| State | Global/Local | Appropriate? | Notes |
|-------|--------------|--------------|-------|
| Active exam session | Feature-global | ✅ | Used across multiple views in the feature |
| Exam editor state | Local | ✅ | Only relevant to the editor flow |
| Filter state | Local | ✅ | Only relevant to the listing view |
| Timer state | Local | ⚠️ | Currently global but could be scoped to the exam view |
| User answers | Feature-global | ✅ | Needs to persist across views and sessions |

## 3. Recommendations

### 3.1 Store Factory Migration

Migrate all stores to use the core `storeFactory.ts` instead of the local deprecated version:

```typescript
// Before
import { createStore, createSelectors } from '../storeFactory';

// After
import { createStore, createSelectors } from '@/core/state';
```

### 3.2 Context Factory Promotion

Consider promoting the `contextFactory.ts` to core as it follows good patterns and could be reused across features.

### 3.3 Store Refactoring

1. **Split Large Stores**: Break down `examStore` into smaller, more focused stores:
   - `examSessionStore`: Manages active exam session state
   - `examNavigationStore`: Manages question navigation
   - `examAnswersStore`: Manages user answers

2. **Consolidate Overlapping Stores**: Consider merging `examAttemptStore` and parts of `examPreparationStore`.

### 3.4 Context Improvements

1. **Performance Optimization**: Migrate `TimerContext` to a Zustand store to prevent unnecessary rerenders.

2. **Consistent Pattern**: Use the context factory consistently for all contexts.

3. **Scope Appropriately**: Ensure contexts are provided at the right level in the component tree to minimize unnecessary rerenders.

### 3.5 Selector Usage

Consistently use selectors with `createSelector` for all Zustand stores to optimize component renders.

## 4. Migration Path

1. **Phase 1**: Update imports to use core store factory
2. **Phase 2**: Refactor large stores into smaller, more focused stores
3. **Phase 3**: Promote contextFactory to core
4. **Phase 4**: Optimize remaining contexts
5. **Phase 5**: Add comprehensive tests for state management

## 5. State Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  UI Components  │     │   Form State    │     │   Server Data   │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ React Contexts  │     │ Zustand Stores  │     │ TanStack Query  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

This analysis provides a clear understanding of the current state management approach in the exams-preparation feature and outlines a path forward to align with architecture principles and improve performance.
