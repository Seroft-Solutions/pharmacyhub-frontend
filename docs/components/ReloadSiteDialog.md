# ReloadSiteDialog Component

A reusable shadcn UI-based dialog that confirms if the user wants to reload the site or navigate away when there are unsaved changes.

## Location

`src/core/ui/dialogs/ReloadSiteDialog.tsx`

## Usage

Import the component from the core UI module:

```tsx
import { ReloadSiteDialog } from '@/core/ui/dialogs';
```

Use it in your component:

```tsx
function MyComponent() {
  const [showDialog, setShowDialog] = useState(false);
  
  // Show dialog when user attempts to leave with unsaved changes
  const handleNavigateAway = () => {
    if (hasUnsavedChanges) {
      setShowDialog(true);
      return false; // Prevent immediate navigation
    }
    return true; // Allow navigation
  };
  
  // Handle reload confirmation
  const handleReload = () => {
    setShowDialog(false);
    // Perform reload or navigation
    window.location.reload();
  };
  
  // Handle cancel
  const handleCancel = () => {
    setShowDialog(false);
  };
  
  return (
    <>
      {/* Your component content */}
      
      <ReloadSiteDialog
        isOpen={showDialog}
        onReload={handleReload}
        onCancel={handleCancel}
        message="Your unsaved changes will be lost." // Optional custom message
      />
    </>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| isOpen | boolean | Yes | - | Controls whether the dialog is displayed |
| onReload | () => void | Yes | - | Callback function called when the user confirms reload |
| onCancel | () => void | Yes | - | Callback function called when the user cancels |
| message | string | No | "Changes you made may not be saved." | Optional custom message to display |

## Example Use Cases

- Prevent accidental navigation away from forms with unsaved changes
- Warn users before refreshing pages with unsaved data
- Confirm before discarding draft content

## Behavior

1. When `isOpen` is set to `true`, the dialog appears as a modal over the current content
2. If the user clicks "Reload", the `onReload` callback is triggered
3. If the user clicks "Cancel", the `onCancel` callback is triggered and the dialog closes

## Notes

- This component does not handle the browser's native beforeunload event. To handle that case, you need to add an event listener separately.
- For a complete implementation with beforeunload handling, see the `ExamPageWrapper` component in `src/features/exams/components/wrappers/ExamPageWrapper.tsx`.

## Example Integration

See `src/components/examples/ReloadDialogExample.tsx` for a working example of the dialog in a form context.