# Incremental Migration Strategy

This document outlines a strategy for implementing the exams feature refactoring incrementally, ensuring the application remains functional throughout the process.

## Key Principles

1. **Feature Flagging**: Use feature flags to toggle between old and new implementations
2. **Parallel Implementation**: Build new components alongside existing ones
3. **Gradual Replacement**: Replace components one by one rather than all at once
4. **Progressive Adoption**: Start with leaf components and work up to container components
5. **Continuous Testing**: Test at each stage to ensure functionality is preserved
6. **Backward Compatibility**: Maintain compatibility with existing components

## Implementation Approach

### Step 1: Create New Directory Structure and Core Types

Start by setting up the new structure without modifying existing code:

1. Create the new directory structure
2. Define core types and constants
3. Setup API integration layer
4. Create initial Zustand stores

This step has no impact on existing functionality since it's purely additive.

### Step 2: Implement Feature Flagging

Add a simple feature flag mechanism to toggle between old and new implementations:

```typescript
// src/features/exams/config.ts
export const FEATURE_FLAGS = {
  USE_NEW_EXAM_STORES: process.env.NODE_ENV === 'development',
  USE_NEW_EXAM_COMPONENTS: process.env.NODE_ENV === 'development',
  USE_NEW_API_LAYER: process.env.NODE_ENV === 'development',
};
```

Use the flags to conditionally import components or stores:

```tsx
// src/pages/exams/[id].tsx
import { FEATURE_FLAGS } from '../../features/exams/config';

// Import both old and new implementations
import { OldExamContainer } from '../../features/exams/components/ExamContainer';
import { NewExamContainer } from '../../features/exams/taking/components/ExamContainer';

export default function ExamPage({ examId, userId }) {
  // Toggle between implementations based on feature flag
  const ExamContainer = FEATURE_FLAGS.USE_NEW_EXAM_COMPONENTS
    ? NewExamContainer
    : OldExamContainer;
  
  return <ExamContainer examId={examId} userId={userId} />;
}
```

### Step 3: Create Adapter/Bridge Components

Create adapter components that bridge between old and new implementations:

```tsx
// src/features/exams/deprecated/adapters/ExamContainerBridge.tsx
import React from 'react';
import { OldExamContainer } from '../components/ExamContainer';
import { useExamTakingStore } from '../../taking/store/examTakingStore';

export const ExamContainerBridge = (props) => {
  // Map new store data to old component props
  const {
    currentExam,
    questions,
    answers,
    // ... other state
    startExam,
    answerQuestion,
    // ... other actions
  } = useExamTakingStore();
  
  // Transform data as needed
  const transformedProps = {
    ...props,
    exam: currentExam,
    questions,
    userAnswers: answers,
    // ... map other props
    onStartExam: startExam,
    onAnswerQuestion: answerQuestion,
    // ... map other callbacks
  };
  
  return <OldExamContainer {...transformedProps} />;
};
```

### Step 4: Implement Core Building Blocks

Start with small, leaf components that have minimal dependencies:

1. Implement utility components like `QuestionText`, `OptionItem`, `ExamTimer`, etc.
2. Create the API services and adapters
3. Implement basic Zustand stores

Test these components in isolation to ensure they work correctly.

### Step 5: Create Feature-Specific Stores

Implement Zustand stores for each domain:

1. Start with the core exam store
2. Implement the exam taking store
3. Add the exam creation store
4. Create the exam review store

Each store should include backward compatibility with existing components.

### Step 6: Migrate Components Bottom-Up

Migrate components starting from the leaf components and working up to containers:

1. **Phase 1**: Replace utility components
   ```tsx
   // Example replacement in existing component
   import { FEATURE_FLAGS } from '../../config';
   import { OldQuestionText } from '../components/QuestionText';
   import { NewQuestionText } from '../../taking/components/QuestionText';
   
   const QuestionText = FEATURE_FLAGS.USE_NEW_EXAM_COMPONENTS
     ? NewQuestionText
     : OldQuestionText;
   ```

2. **Phase 2**: Replace mid-level components
   ```tsx
   // Example replacement in existing component
   import { FEATURE_FLAGS } from '../../config';
   import { OldQuestionDisplay } from '../components/QuestionDisplay';
   import { NewQuestionDisplay } from '../../taking/components/QuestionDisplay';
   
   const QuestionDisplay = FEATURE_FLAGS.USE_NEW_EXAM_COMPONENTS
     ? NewQuestionDisplay
     : OldQuestionDisplay;
   ```

3. **Phase 3**: Replace container components
   ```tsx
   // Example replacement in page component
   import { FEATURE_FLAGS } from '../../config';
   import { OldExamContainer } from '../components/ExamContainer';
   import { NewExamSession } from '../../taking/components/ExamSession';
   
   const ExamContainer = FEATURE_FLAGS.USE_NEW_EXAM_COMPONENTS
     ? NewExamSession
     : OldExamContainer;
   ```

### Step 7: Implement API Integration

Replace API calls with the new API layer:

1. Create an adapter that maps between old and new API formats
2. Update components to use the new API layer with feature flags
3. Test API integration thoroughly

```tsx
// Example API adapter
import { FEATURE_FLAGS } from '../../config';
import { oldExamApi } from '../api/examApi';
import { examApiService } from '../../api/services/examApiService';

export const examApi = {
  getExamById: async (examId) => {
    if (FEATURE_FLAGS.USE_NEW_API_LAYER) {
      const response = await examApiService.getExamById(examId);
      return response.data;
    } else {
      return oldExamApi.getExamById(examId);
    }
  },
  // ... other methods
};
```

### Step 8: Transition to New Implementation

Gradually enable feature flags for different parts of the application:

1. Start with development environment
2. Test each feature flag individually
3. Enable flags for specific users or scenarios in production
4. Roll out changes incrementally

```typescript
// Example dynamic feature flags (can be controlled via API or local storage)
export const FEATURE_FLAGS = {
  USE_NEW_EXAM_STORES: 
    localStorage.getItem('USE_NEW_EXAM_STORES') === 'true' || 
    process.env.NODE_ENV === 'development',
  USE_NEW_EXAM_COMPONENTS: 
    localStorage.getItem('USE_NEW_EXAM_COMPONENTS') === 'true' || 
    process.env.NODE_ENV === 'development',
  USE_NEW_API_LAYER: 
    localStorage.getItem('USE_NEW_API_LAYER') === 'true' || 
    process.env.NODE_ENV === 'development',
};

// Admin component to toggle feature flags
const FeatureFlagToggle = () => {
  const [flags, setFlags] = useState({
    USE_NEW_EXAM_STORES: localStorage.getItem('USE_NEW_EXAM_STORES') === 'true',
    USE_NEW_EXAM_COMPONENTS: localStorage.getItem('USE_NEW_EXAM_COMPONENTS') === 'true',
    USE_NEW_API_LAYER: localStorage.getItem('USE_NEW_API_LAYER') === 'true',
  });
  
  const toggleFlag = (flag) => {
    const newValue = !flags[flag];
    localStorage.setItem(flag, newValue.toString());
    setFlags({ ...flags, [flag]: newValue });
    window.location.reload(); // Force reload to apply changes
  };
  
  return (
    <div>
      <h2>Feature Flags</h2>
      {Object.entries(flags).map(([flag, enabled]) => (
        <div key={flag}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => toggleFlag(flag)}
          />
          <label>{flag}</label>
        </div>
      ))}
    </div>
  );
};
```

### Step 9: Clean Up and Remove Old Code

Once the new implementation is fully tested and deployed:

1. Remove feature flags
2. Move old components to deprecated folder
3. Update all imports to use new components
4. Remove deprecated components after a grace period

## Migration Roadmap

Here's a suggested roadmap for implementing the migration:

### Week 1: Setup and Core Implementation
- Create directory structure and core types
- Setup API integration layer
- Implement feature flags
- Create initial Zustand stores

### Week 2: Component Migration Phase 1
- Implement leaf components
- Create adapter components
- Test components in isolation
- Implement core store functionality

### Week 3: Component Migration Phase 2
- Implement mid-level components
- Enhance Zustand stores
- Add API integration
- Test component integration

### Week 4: Component Migration Phase 3
- Implement container components
- Complete Zustand store implementation
- Test end-to-end functionality
- Enable feature flags in development

### Week 5: Testing and Refinement
- Comprehensive testing
- Fix bugs and issues
- Performance optimization
- Documentation updates

### Week 6: Deployment and Cleanup
- Gradual rollout in production
- Monitor for issues
- Remove feature flags
- Clean up deprecated code

## Testing Strategy

To ensure the migration maintains functionality, follow this testing strategy:

1. **Unit Testing**: Test individual components and stores
2. **Integration Testing**: Test component interactions
3. **Manual Testing**: Verify end-to-end functionality
4. **A/B Testing**: Compare old and new implementations
5. **Performance Testing**: Measure performance impact

Use feature flags to enable A/B testing between old and new implementations.

## Rollback Plan

In case of issues, have a rollback plan ready:

1. **Quick Rollback**: Toggle feature flags off
2. **Component Rollback**: Replace specific components
3. **Full Rollback**: Revert to previous version

## Conclusion

This incremental migration strategy allows for a smooth transition from the current implementation to the new feature-based architecture. By using feature flags and adapter components, you can maintain functionality while progressively improving the codebase.

Key benefits of this approach:
- Minimizes risk by making small, testable changes
- Maintains application functionality throughout the process
- Allows for easier troubleshooting of issues
- Provides flexibility in deployment timing
- Enables easy rollback if needed
