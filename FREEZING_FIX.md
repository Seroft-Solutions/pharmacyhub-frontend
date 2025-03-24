# UI Freezing Fix for PharmacyHub Frontend

This document explains how to fix UI freezing issues in the PharmacyHub frontend application caused by excessive localStorage operations.

## Quick Fix (For Immediate Relief)

If you're experiencing UI freezing right now, follow these steps:

1. Open the browser console (F12 or right-click → Inspect → Console)
2. Run this command:
   ```javascript
   await fetch('/fixFreezing.js').then(r => r.text()).then(eval)
   ```
3. Refresh the page

This will:
- Clean up problematic localStorage entries
- Throttle future localStorage operations
- Clear any pending timeouts that might be causing freezes

## Emergency Reset (Last Resort)

If the quick fix doesn't work, you can completely reset the application state:

1. Open the browser console
2. Run this command:
   ```javascript
   await fetch('/clearAll.js').then(r => r.text()).then(eval)
   ```
3. The page will automatically refresh after 2 seconds

This will clear all localStorage data (except authentication tokens) and reset the application to a clean state.

## Root Cause

The UI freezing issue is caused by excessive synchronous localStorage operations, primarily from Zustand stores with persistence:

1. `exam-store` - Stores exam questions, answers, and state
2. `manual-payment-store` - Stores payment information and premium access status

These stores were writing to localStorage too frequently without throttling, causing the main thread to block and the UI to freeze.

## Permanent Fixes Implemented

We've implemented several permanent fixes to prevent this issue:

1. **Throttled Storage Adapter**: All localStorage operations are now throttled and batched with debouncing.
2. **Error Recovery**: Better error handling for localStorage operations, including recovery from quota exceeded errors.
3. **Reduced Persistence**: More selective state persistence to reduce the amount of data stored.
4. **Emergency Scripts**: Added emergency fix scripts in the `/public` directory.

## For Developers

When implementing new features with persisted stores:

1. Always use the throttled storage adapter:
   ```typescript
   import { throttledStorage } from '@/features/core/storage';
   import { createJSONStorage } from 'zustand/middleware';

   const store = create(
     persist(
       (set, get) => ({ /* state and actions */ }),
       {
         name: 'your-store-name',
         storage: createJSONStorage(() => throttledStorage)
       }
     )
   );
   ```

2. Be selective about what you persist:
   ```typescript
   {
     // ...
     partialize: (state) => ({
       // Only include necessary fields
       importantData: state.importantData,
       // Exclude unnecessary or large data
       // largeData: state.largeData
     })
   }
   ```

## Testing Storage Performance

To monitor localStorage performance and detect potential issues:

1. Add the diagnostics panel to your layout component:
   ```tsx
   import { DiagnosticsPanel } from '@/features/core/debug';

   function Layout({ children }) {
     return (
       <>
         {children}
         {process.env.NODE_ENV === 'development' && <DiagnosticsPanel />}
       </>
     );
   }
   ```

2. Watch the localStorage tab in the diagnostics panel to identify large or frequently updated items.

## Further Resources

For more information on optimizing localStorage usage and preventing UI freezing:

- [Storage Module Documentation](/src/features/core/storage/README.md)
- [Debug Tools Documentation](/src/features/core/debug/README.md)
- [Web Storage API Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#testing_for_availability)