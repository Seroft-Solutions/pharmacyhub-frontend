# Debug Tools

This module provides utilities for debugging and troubleshooting application issues, particularly focused on localStorage issues and UI freezing.

## DiagnosticsPanel

The `DiagnosticsPanel` component provides a floating diagnostic panel that can help troubleshoot common issues:

- LocalStorage inspection and cleanup
- API request monitoring
- Performance metrics
- Emergency fixes for common issues

### Integration

To add the diagnostics panel to your application, import it and add it to your layout or page component:

```tsx
// In app/layout.tsx or any page component where you want it available
import { DiagnosticsPanel } from '@/features/core/debug';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <DiagnosticsPanel />
    </>
  );
}
```

### Development-Only Usage

To show the diagnostics panel only in development mode, you can conditionally render it:

```tsx
import { DiagnosticsPanel } from '@/features/core/debug';

export default function Layout({ children }) {
  return (
    <>
      {children}
      {process.env.NODE_ENV === 'development' && <DiagnosticsPanel />}
    </>
  );
}
```

## Emergency Reset Script

An emergency reset script is also available in the `public` directory. You can use it when experiencing UI freezes or other critical issues:

1. Open the browser console
2. Run:
   ```js
   fetch('/emergency-reset.js').then(r => r.text()).then(t => eval(t))
   ```
3. Follow the instructions displayed in the console
4. Refresh the page

This script provides emergency fixes for common issues like localStorage corruption and infinite update loops.
