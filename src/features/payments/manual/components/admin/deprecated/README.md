# Deprecated Components

This directory contains components that have been deprecated in favor of newer implementations.

## ManualPaymentsAdminDashboard.tsx

This component was the original implementation of the payment approval dashboard. It has been replaced by a more modern and feature-rich implementation located at:

```
/src/features/payments/admin/
```

The new implementation offers several advantages:

1. Better organization with a proper feature-based architecture
2. Improved UI/UX with more modern design patterns
3. Better component structure for maintainability
4. Enhanced screenshot handling and viewing experience
5. Improved mobile responsiveness
6. Better error handling and user feedback

### Migration

If you were using the `ManualPaymentsAdminDashboard` component, you should migrate to the new implementation by using the components from the `/features/payments/admin` directory.

The new page implementation can be found at:
```
/app/admin/payments/approvals/page.tsx
```

This component is kept for reference purposes only and should not be used in new code.