# Mobile Support Feature

## Overview

The Mobile Support feature provides a comprehensive solution for handling mobile responsiveness throughout the PharmacyHub application. It includes Zustand stores for viewport detection, responsive components, utility functions, and global CSS styles.

## Key Components

### Store

- `useMobileStore`: A Zustand store that tracks viewport size and provides selectors for different device types.
- Includes selectors such as `selectIsMobile`, `selectIsTablet`, and `selectIsDesktop` to make responsive code easier to write.
- Automatically detects viewport changes through resize and orientation change events.

### Components

- `MobileWrapper`: Base component for handling responsive rendering
- `MobileOnly`: Component that only renders on mobile devices
- `DesktopOnly`: Component that only renders on desktop devices
- `TabletAndDesktop`: Component that renders on tablets and desktops but not on mobile
- `ResponsiveContainer`: Container that adapts its layout based on viewport

### Utilities

- Viewport detection functions like `isMobile()`, `isTablet()`, etc.
- Device orientation helpers (`isPortrait()`, `isLandscape()`)
- Device type detection through `getDeviceType()`

### Styles

Global CSS styles are provided in `utils/mobile-styles.css` and automatically imported into the application. These styles include:

- Responsive adjustments for sidebar width and positioning
- Enhanced mobile experience for modal dialogs
- Fix for iOS Safari viewport height issues
- Improvements to touch targets for better mobile usability

## Integration with Other Features

The Mobile Support feature integrates with:

1. **Shell Feature**: Provides responsive behavior for the sidebar, topbar, and content area
2. **UI Components**: Enhances core UI components with responsive behavior
3. **Layout System**: Ensures proper rendering across all device sizes

## Usage Guidelines

### For Component Development

When creating new components, use the provided utilities and selectors:

```tsx
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

function MyComponent() {
  // Use as a hook with selector
  const isMobile = useMobileStore(selectIsMobile);
  
  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      {/* Component content */}
    </div>
  );
}
```

### For Styling

Use the data attributes provided by the sidebar components for targeting specific elements:

```css
/* Target the sidebar's content area */
[data-sidebar="content-area"] {
  /* Custom styles */
}

/* Target mobile-specific sidebar */
[data-sidebar="sidebar"][data-mobile="true"] {
  /* Mobile-specific styles */
}
```

## Recent Improvements

1. Fixed sidebar toggle functionality in mobile mode
2. Improved component sizing in mobile view
3. Enhanced sidebar width calculation with CSS variables
4. Added detection for orientation changes
5. Fixed iOS Safari-specific viewport issues
