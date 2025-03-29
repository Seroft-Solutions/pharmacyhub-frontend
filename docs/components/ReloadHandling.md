# Reload Dialog & Unsaved Changes Handling

## Overview

The Pharmacy Hub application now has a robust system for handling unsaved changes and page reloads during exams. When a user has made changes to an exam (answering questions, flagging questions, etc.) and attempts to navigate away or reload the page, they are presented with a dialog to confirm their action.

## Components

### 1. ReloadSiteDialog

**Location:** `src/core/ui/dialogs/ReloadSiteDialog.tsx`

A general-purpose dialog that can be used throughout the application to confirm reloading or navigating away when there are unsaved changes. It displays a simple message with "Reload" and "Cancel" buttons.

### 2. ExamReloadDialog

**Location:** `src/core/ui/dialogs/ExamReloadDialog.tsx`

An enhanced version of the ReloadSiteDialog specifically for exams. It includes:
- Option to save changes before reloading
- Checkbox to prevent additional dialogs
- Improved styling and layout

### 3. ExamPageContainer

**Location:** `src/features/exams/components/layout/ExamPageContainer.tsx`

A wrapper component for exam pages that:
- Tracks unsaved changes using the examStore
- Intercepts navigation and reload attempts
- Shows the custom reload dialog when needed
- Handles saving exam progress before navigation

### 4. ExamReloadHandler

**Location:** `src/features/exams/components/shared/ExamReloadHandler.tsx`

A utility component that intercepts reload/navigation attempts and provides a consistent interface for showing the reload dialog.

## Store Enhancements

The examStore has been enhanced to track unsaved changes:

```typescript
// New state
hasUnsavedChanges: boolean;

// New methods
markChangesUnsaved: () => void;
markChangesSaved: () => void;
saveExamProgress: () => Promise<boolean>;
```

Actions that modify exam state (answering questions, flagging, etc.) now automatically mark changes as unsaved.

## Integration

The ExamPageContainer is integrated in the exam page:

```tsx
// src/app/(exams)/exam/[id]/page.tsx
<ExamPageContainer examId={examId} userId={userId}>
  <ExamContainer
    examId={examId}
    userId={userId}
    onExit={handleExit}
    showTimer={true}
    examType={examType as 'past' | 'model' | 'subject'}
  />
</ExamPageContainer>
```

## Browser Reload Handling

For direct browser actions (clicking the refresh button in the browser toolbar), we still use the standard browser confirmation dialog, as browsers don't allow custom UI to be shown during the beforeunload event. However, for in-app navigation and reload actions, we use our custom dialogs for better UX.

## Benefits

1. **Consistent UI**: Uses shadcn UI components for a consistent look and feel
2. **Improved UX**: Custom dialogs with save options and clear messaging
3. **Data Protection**: Prevents accidental loss of exam progress
4. **Flexibility**: Can be easily extended to other parts of the application

## Usage in Other Features

The ReloadSiteDialog can be used in any part of the application where unsaved changes need to be tracked. Simply import and use it:

```tsx
import { ReloadSiteDialog } from '@/core/ui/dialogs';

function MyComponent() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  
  // Show dialog when navigating away with unsaved changes
  const handleNavigation = () => {
    if (hasUnsavedChanges) {
      setShowDialog(true);
      return false;
    }
    return true;
  };
  
  return (
    <>
      {/* Component content */}
      
      <ReloadSiteDialog
        isOpen={showDialog}
        onReload={() => {/* Handle reload */}}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
}
```