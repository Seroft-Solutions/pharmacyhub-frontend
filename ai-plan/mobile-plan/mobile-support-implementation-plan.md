# Mobile Support Feature Implementation Plan

- ✅ `GIVEN → WHEN → THEN` flow  
- ✅ directory placement  
- ✅ tanstack integration  
- ✅ modular, non-hook state using **Zustand**

---

## ✅ Feature Architecture Plan: `mobile-support`

### 📁 Feature Path:
```
D:\code\PharmacyHub\pharmacyhub-frontend\src\features\core\mobile-support
```

---

## 🔍 GIVEN → WHEN → THEN Planning

### ✅ GIVEN:
- The project aims for full **mobile compatibility** across core flows like `exams`, `payments`, `auth`.
- No centralized utility exists today to detect mobile mode, or conditionally render layouts based on mobile constraints.
- Each feature manually handles mobile layout logic or breakpoints (if any).

### ✅ WHEN:
- We introduce a **new core feature**: `mobile-support`, that:
  - ✅ Detects mobile viewport
  - ✅ Stores viewport state using **Zustand**
  - ✅ Provides composable utility functions and optional wrappers for mobile rendering
  - ✅ Exposes a clean API to be used across `exams`, `payments`, etc.

### ✅ THEN:
- All features can **import and reuse** `mobile-support`'s logic
- No duplication of viewport detection or media queries
- Future mobile enhancements (e.g. gesture support, mobile-only toggles) happen in one place
- We gain consistency, modularity, and maintainability across the platform

---

## 🔧 Implementation Plan

### ✅ Directory Structure (Blueprint Standard)
```
src/features/core/mobile-support/
├── components/             # Shared mobile-specific wrappers
│   └── MobileWrapper.tsx
├── store/                  # Zustand store to track device type
│   └── useMobileStore.ts
├── utils/                  # Utility to check screen size or SSR-safe detection
│   └── isMobile.ts
├── index.ts                # Public interface
├── README.md
```

### ✅ Zustand Store (non-hook state):
- Store in `store/useMobileStore.ts`
- Detects device type once and stores a global `isMobile` flag
- Features can consume via Zustand, not React hooks

---

## 🔌 TanStack Query Touchpoint
No direct TanStack dependency **inside `mobile-support`** —  
But mobile-aware wrappers **should be available to wrap any TanStack-enabled component** if layout changes are needed.

---

## 📋 Implementation Checklist

### 1. Directory Structure
- [ ] Create `mobile-support` directory in `src/features/core`
- [ ] Create subdirectories: `components`, `store`, `utils`
- [ ] Create README.md and index.ts files

### 2. Zustand Store Implementation
- [ ] Implement `useMobileStore.ts` with proper state interface and actions
- [ ] Add viewport detection with breakpoint constants
- [ ] Add window resize event listener for responsive updates
- [ ] Create selectors for common viewport queries
- [ ] Ensure SSR compatibility with safe window checks

### 3. Utility Functions
- [ ] Implement `isMobile.ts` with helper detection functions
- [ ] Add orientation detection utilities (portrait/landscape)
- [ ] Ensure consistent breakpoint usage across the feature
- [ ] Add proper TypeScript typing and documentation

### 4. Component Implementation
- [ ] Create `MobileWrapper.tsx` with responsive rendering strategies
- [ ] Implement specialized components (MobileOnly, DesktopOnly)
- [ ] Add support for responsive class switching
- [ ] Ensure components use Zustand state, not React hooks

### 5. Documentation & Integration
- [ ] Document usage examples in README.md
- [ ] Export complete public API through index.ts
- [ ] Test integration with other features

---

## 🔬 Technical Implementation Details

### Store Design (`useMobileStore.ts`)

```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Define breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,  // Small devices
  md: 768,  // Medium devices (tablets)
  lg: 1024, // Large devices (desktops)
  xl: 1280, // Extra large devices
};

// State interface
interface MobileState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

// Actions interface
interface MobileActions {
  checkViewport: () => void;
}

// Create Zustand store
export const useMobileStore = create<MobileState & MobileActions>()(
  subscribeWithSelector((set) => ({
    // SSR-safe defaults
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768,
    
    // Action to update viewport state
    checkViewport: () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      set({
        width,
        height,
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
      });
    },
  }))
);

// Initialize on client-side
if (typeof window !== 'undefined') {
  useMobileStore.getState().checkViewport();
  window.addEventListener('resize', useMobileStore.getState().checkViewport);
}

// Export selectors
export const selectIsMobile = (state: MobileState) => state.isMobile;
export const selectIsTablet = (state: MobileState) => state.isTablet;
export const selectIsDesktop = (state: MobileState) => state.isDesktop;
export const selectViewportSize = (state: MobileState) => ({
  width: state.width,
  height: state.height,
});
```

### Utility Functions (`isMobile.ts`)

```typescript
import { BREAKPOINTS } from '../store/useMobileStore';

/**
 * SSR-safe check for mobile viewport
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
};

/**
 * SSR-safe check for tablet viewport
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
};

/**
 * SSR-safe check for desktop viewport
 */
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= BREAKPOINTS.lg;
};

/**
 * Check for portrait orientation
 */
export const isPortrait = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerHeight > window.innerWidth;
};

/**
 * Check for landscape orientation
 */
export const isLandscape = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth > window.innerHeight;
};
```

### Component Implementation (`MobileWrapper.tsx`)

```typescript
import React from 'react';
import { useMobileStore, selectIsMobile, selectIsTablet, selectIsDesktop } from '../store/useMobileStore';

type RenderStrategy = 'show-mobile-only' | 'hide-mobile-only' | 'responsive';

interface MobileWrapperProps {
  children: React.ReactNode;
  mobileChildren?: React.ReactNode;
  tabletChildren?: React.ReactNode;
  desktopChildren?: React.ReactNode;
  strategy?: RenderStrategy;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

/**
 * Adaptively renders content based on device viewport
 */
export const MobileWrapper: React.FC<MobileWrapperProps> = ({
  children,
  mobileChildren,
  tabletChildren,
  desktopChildren,
  strategy = 'responsive',
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
}) => {
  // Use selectors to get only what we need from the store
  const isMobile = useMobileStore(selectIsMobile);
  const isTablet = useMobileStore(selectIsTablet);
  const isDesktop = useMobileStore(selectIsDesktop);
  
  // Handle show-mobile-only strategy
  if (strategy === 'show-mobile-only') {
    if (!isMobile) return null;
    return (
      <div className={`${className} ${mobileClassName}`}>
        {mobileChildren || children}
      </div>
    );
  }
  
  // Handle hide-mobile-only strategy
  if (strategy === 'hide-mobile-only') {
    if (isMobile) return null;
    return (
      <div className={`${className} ${isTablet ? tabletClassName : desktopClassName}`}>
        {isTablet && tabletChildren ? tabletChildren : 
         isDesktop && desktopChildren ? desktopChildren : children}
      </div>
    );
  }
  
  // Handle responsive strategy (default)
  return (
    <div className={`${className} ${
      isMobile ? mobileClassName : 
      isTablet ? tabletClassName : 
      desktopClassName
    }`}>
      {isMobile && mobileChildren ? mobileChildren : 
       isTablet && tabletChildren ? tabletChildren : 
       isDesktop && desktopChildren ? desktopChildren : 
       children}
    </div>
  );
};

/**
 * MobileOnly component that only renders on mobile devices
 */
export const MobileOnly: React.FC<Omit<MobileWrapperProps, 'strategy'>> = (props) => (
  <MobileWrapper {...props} strategy="show-mobile-only" />
);

/**
 * DesktopOnly component that only renders on non-mobile devices
 */
export const DesktopOnly: React.FC<Omit<MobileWrapperProps, 'strategy'>> = (props) => (
  <MobileWrapper {...props} strategy="hide-mobile-only" />
);
```

### Main Export (`index.ts`)

```typescript
// Export all components
export { MobileWrapper, MobileOnly, DesktopOnly } from './components/MobileWrapper';

// Export store and selectors
export {
  useMobileStore,
  selectIsMobile,
  selectIsTablet,
  selectIsDesktop,
  selectViewportSize,
  BREAKPOINTS
} from './store/useMobileStore';

// Export utility functions
export {
  isMobile,
  isTablet,
  isDesktop,
  isPortrait,
  isLandscape
} from './utils/isMobile';
```

---

## 🔁 Integration Use Cases

### 1. **Exams Feature**
- Use mobile-support to show compact question card layout
- Auto-adapt timer component to floating mobile position

```tsx
import { MobileWrapper } from '@/features/core/mobile-support';

const QuestionCard = () => {
  return (
    <MobileWrapper
      mobileChildren={<CompactQuestionLayout />}
      desktopChildren={<FullQuestionLayout />}
      mobileClassName="p-2"
      desktopClassName="p-6"
    />
  );
};
```

### 2. **Payments Feature**
- Use centralized mobile wrapper to shrink form padding and inputs
- Auto-switch to stepper-style payment flow on mobile

```tsx
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

const PaymentForm = () => {
  const isMobile = useMobileStore(selectIsMobile);
  
  return (
    <div>
      {isMobile 
        ? <StepperPaymentFlow /> 
        : <DesktopPaymentForm />
      }
    </div>
  );
};
```

### 3. **RBAC, Auth, Admin**
- Reuse mobile-support conditionals to control grid layout and modals

```tsx
import { MobileOnly, DesktopOnly } from '@/features/core/mobile-support';

const AdminPanel = () => {
  return (
    <>
      <MobileOnly>
        <MobileNavigation />
        <SingleColumnLayout />
      </MobileOnly>
      
      <DesktopOnly>
        <SidebarNavigation />
        <MultiColumnLayout />
      </DesktopOnly>
    </>
  );
};
```

---

## 🛑 Do Not:
- ❌ Use inline media queries in individual components  
- ❌ Copy mobile detection logic into multiple features  
- ❌ Use React state/hooks for screen size — use **Zustand** centrally  

---

## 💥 Implementation Approach
1. Scaffold the directory structure first
2. Implement the store with proper testing
3. Add utility functions
4. Create components with documentation
5. Test across different viewport sizes
6. Integrate with one feature as a test case