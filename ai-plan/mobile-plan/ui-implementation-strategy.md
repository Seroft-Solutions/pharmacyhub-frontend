# PharmacyHub Exams Feature - Mobile UI Implementation Strategy

## Introduction

This document outlines the UI implementation strategy for making the PharmacyHub Exams feature mobile-compatible. It focuses on UI architecture and patterns to ensure a cohesive, responsive experience across devices.

## Responsive Design Philosophy

Our approach follows these key principles:

1. **Mobile-First Development**: Design for mobile first, then enhance for larger screens
2. **Progressive Enhancement**: Start with core functionality, then add advanced features for capable devices
3. **Consistent Experience**: Maintain feature parity between mobile and desktop while optimizing for each
4. **Performance-Focused**: Prioritize performance for mobile users with limited bandwidth and processing power

## Tailwind CSS Implementation Strategy

### Breakpoint Usage Pattern

We'll use Tailwind's breakpoint system consistently throughout the application:

```jsx
// Example of consistent breakpoint pattern
<div className="
  flex flex-col p-3 gap-2 rounded-lg          /* Mobile (default) */
  sm:p-4 sm:gap-3                             /* Small tablet (640px+) */
  md:flex-row md:p-5 md:items-center          /* Medium tablet/small laptop (768px+) */
  lg:gap-4 lg:p-6                             /* Large desktop (1024px+) */
">
  {/* Content */}
</div>
```

### Custom Screen Sizes

We'll add custom breakpoints for specific mobile device sizes:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'xs': '400px',        // Small mobile phones
        'sm': '640px',        // Large mobile phones
        'md': '768px',        // Tablets
        'lg': '1024px',       // Laptops
        'xl': '1280px',       // Desktops
        '2xl': '1536px',      // Large desktops
      },
    },
  },
  // ...
}
```

### Custom Utility Classes for Mobile

We'll create specific utility classes to handle common mobile patterns:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // ...
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    // Custom plugin for mobile-specific utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.touch-callout-none': {
          '-webkit-touch-callout': 'none',
        },
        '.tap-highlight-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.safe-area-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-area-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.h-screen-safe': {
          height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        },
      }
      addUtilities(newUtilities)
    }
  ],
  // ...
}
```

## Responsive Implementation Approach

### 1. Layout Components

We'll create layout components that intelligently render based on screen size:

```tsx
// src/features/exams/components/layout/ResponsiveExamLayout.tsx
import React from 'react';
import { useMobileCapabilities } from '../../hooks/useMobileCapabilities';

interface ResponsiveExamLayoutProps {
  navigation: React.ReactNode;
  mainContent: React.ReactNode;
  auxiliaryContent?: React.ReactNode;
}

export function ResponsiveExamLayout({
  navigation,
  mainContent,
  auxiliaryContent
}: ResponsiveExamLayoutProps) {
  const { isMobile, isTablet } = useMobileCapabilities();
  
  // Mobile layout (stacked with bottom nav)
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen relative">
        {/* Main content takes full height minus bottom nav */}
        <main className="flex-1 pb-16 overflow-y-auto">
          {mainContent}
        </main>
        
        {/* Bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t safe-area-bottom">
          {navigation}
        </nav>
        
        {/* Auxiliary content renders as modal/sheet when needed */}
        {auxiliaryContent && (
          <div className="fixed inset-0 z-50">
            {auxiliaryContent}
          </div>
        )}
      </div>
    );
  }
  
  // Tablet layout (sidebar)
  if (isTablet) {
    return (
      <div className="grid grid-cols-[1fr_280px] min-h-screen">
        <main className="overflow-y-auto">
          {mainContent}
        </main>
        
        <aside className="border-l bg-gray-50 overflow-y-auto">
          {navigation}
          {auxiliaryContent && (
            <div className="border-t mt-4 pt-4">
              {auxiliaryContent}
            </div>
          )}
        </aside>
      </div>
    );
  }
  
  // Desktop layout (main + right sidebar + optional left sidebar)
  return (
    <div className="grid grid-cols-[240px_1fr_300px] min-h-screen">
      <aside className="border-r bg-gray-50 overflow-y-auto">
        {auxiliaryContent}
      </aside>
      
      <main className="overflow-y-auto">
        {mainContent}
      </main>
      
      <aside className="border-l bg-gray-50 overflow-y-auto">
        {navigation}
      </aside>
    </div>
  );
}
```

### 2. Conditional Rendering Strategy

For complex UIs, we'll implement a strategy pattern for different screen sizes:

```tsx
// src/features/exams/components/quiz/ResponsiveQuizDisplay.tsx
import React from 'react';
import { useMobileCapabilities } from '../../hooks/useMobileCapabilities';
import { MobileQuizView } from './MobileQuizView';
import { TabletQuizView } from './TabletQuizView';
import { DesktopQuizView } from './DesktopQuizView';

interface ResponsiveQuizDisplayProps {
  exam: Exam;
  currentQuestion: number;
  // ...other props
}

export function ResponsiveQuizDisplay(props: ResponsiveQuizDisplayProps) {
  const { screenSize } = useMobileCapabilities();
  
  // Choose the appropriate component based on screen size
  if (screenSize.width < 640) {
    return <MobileQuizView {...props} />;
  }
  
  if (screenSize.width < 1024) {
    return <TabletQuizView {...props} />;
  }
  
  return <DesktopQuizView {...props} />;
}
```

### 3. Component Composition Patterns

We'll use composition to reuse elements between different viewport sizes:

```tsx
// src/features/exams/components/common/QuestionCard.tsx
import React from 'react';
import { useMobileCapabilities } from '../../hooks/useMobileCapabilities';

// Core question content (used across all viewports)
export function QuestionContent({ question, onSelect, selectedOption }) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium sm:text-lg">
        {question.text}
      </h3>
      
      <div className="space-y-2">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Mobile-specific card
function MobileQuestionCard(props) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <QuestionContent {...props} />
      <div className="mt-4 flex justify-between">
        <button className="text-sm text-blue-600">Flag</button>
        <span className="text-sm text-gray-500">
          Question {props.index + 1} of {props.total}
        </span>
      </div>
    </div>
  );
}

// Desktop/tablet card with more features
function DesktopQuestionCard(props) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Question {props.index + 1} of {props.total}
        </span>
        <div className="space-x-2">
          <button className="text-sm text-blue-600">Flag</button>
          <button className="text-sm text-blue-600">Note</button>
        </div>
      </div>
      
      <QuestionContent {...props} />
      
      <div className="mt-6 pt-4 border-t text-sm text-gray-500">
        <div>Points: {props.question.points}</div>
      </div>
    </div>
  );
}

// Responsive wrapper that chooses the appropriate card
export function QuestionCard(props) {
  const { isMobile } = useMobileCapabilities();
  
  return isMobile 
    ? <MobileQuestionCard {...props} /> 
    : <DesktopQuestionCard {...props} />;
}
```

### 4. Responsive Variants Pattern

We'll implement variants for components that need different layouts on mobile:

```tsx
// src/features/exams/components/results/ExamResultsChart.tsx
import React from 'react';
import { useMobileCapabilities } from '../../hooks/useMobileCapabilities';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ExamResultsChartProps {
  correct: number;
  incorrect: number;
  unanswered: number;
  variant?: 'compact' | 'detailed' | 'responsive';
}

export function ExamResultsChart({
  correct,
  incorrect,
  unanswered,
  variant = 'responsive'
}: ExamResultsChartProps) {
  const { isMobile } = useMobileCapabilities();
  const activeVariant = variant === 'responsive' 
    ? (isMobile ? 'compact' : 'detailed') 
    : variant;
  
  const data = [
    { name: 'Correct', value: correct, color: '#22c55e' },
    { name: 'Incorrect', value: incorrect, color: '#ef4444' },
    { name: 'Unanswered', value: unanswered, color: '#94a3b8' }
  ];
  
  if (activeVariant === 'compact') {
    // Simple mobile-friendly chart
    return (
      <div className="p-4">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="text-xs">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Detailed chart for larger screens
  return (
    <div className="p-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        {data.map((entry) => (
          <div 
            key={entry.name} 
            className="flex flex-col items-center p-3 rounded-lg border"
            style={{ borderColor: entry.color }}
          >
            <div 
              className="w-4 h-4 rounded-full mb-1" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="font-medium">{entry.name}</span>
            <span className="text-lg font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Mobile-Specific UI Patterns

### 1. Bottom Sheets

We'll implement a reusable bottom sheet component for mobile navigation and actions:

```tsx
// src/components/ui/bottom-sheet.tsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useSpring, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: string[];
  initialSnapPoint?: number;
  showBackdrop?: boolean;
  showDragHandle?: boolean;
  showCloseButton?: boolean;
  title?: string;
  className?: string;
}

export function BottomSheet({
  children,
  isOpen,
  onClose,
  snapPoints = ['50%', '90%'],
  initialSnapPoint = 0,
  showBackdrop = true,
  showDragHandle = true,
  showCloseButton = false,
  title,
  className
}: BottomSheetProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(initialSnapPoint);
  
  // Reset to initial snap point when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentSnapPoint(initialSnapPoint);
    }
  }, [isOpen, initialSnapPoint]);
  
  // Handle drag end
  const handleDragEnd = (_: any, info: PanInfo) => {
    const { velocity, offset } = info;
    
    // Close if dragged down with velocity
    if (velocity.y > 500) {
      onClose();
      return;
    }
    
    // Close if dragged down more than half the height
    if (offset.y > window.innerHeight * 0.25) {
      onClose();
      return;
    }
    
    // Determine closest snap point based on drag
    const currentHeight = parseFloat(snapPoints[currentSnapPoint]) / 100 * window.innerHeight;
    const draggedHeight = currentHeight - offset.y;
    const draggedPercent = (draggedHeight / window.innerHeight) * 100;
    
    // Find nearest snap point
    const distances = snapPoints.map((point, index) => {
      const pointPercent = parseFloat(point);
      return { 
        index, 
        distance: Math.abs(pointPercent - draggedPercent) 
      };
    });
    
    const nearest = distances.reduce((prev, curr) => 
      prev.distance < curr.distance ? prev : curr
    );
    
    setCurrentSnapPoint(nearest.index);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {showBackdrop && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 tap-highlight-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}
          
          {/* Sheet */}
          <motion.div
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-50 touch-callout-none",
              className
            )}
            style={{ 
              height: snapPoints[currentSnapPoint] 
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            {showDragHandle && (
              <div className="p-2 text-center">
                <div className="mx-auto w-10 h-1 bg-gray-300 rounded-full" />
              </div>
            )}
            
            {/* Title bar */}
            {(title || showCloseButton) && (
              <div className="px-4 py-3 border-b flex items-center justify-between">
                {title && <h3 className="text-lg font-medium">{title}</h3>}
                {showCloseButton && (
                  <button 
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={onClose}
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="overflow-auto" style={{ 
              height: title || showDragHandle 
                ? 'calc(100% - 40px)' 
                : '100%' 
            }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 2. Swipe Gestures

We'll implement a hook for swipe interactions on mobile:

```tsx
// src/hooks/useSwipeGesture.ts
import { useState, useRef, useCallback } from 'react';

interface SwipeOptions {
  minDistance?: number;
  maxDuration?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  isSwiping: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: {
    x: number;
    y: number;
  };
}

export function useSwipeGesture({
  minDistance = 50,
  maxDuration = 500,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown
}: SwipeOptions = {}) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    distance: { x: 0, y: 0 }
  });
  
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    setSwipeState({
      isSwiping: true,
      direction: null,
      distance: { x: 0, y: 0 }
    });
  }, []);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touch = e.touches[0];
    const distance = {
      x: touch.clientX - touchStart.current.x,
      y: touch.clientY - touchStart.current.y
    };
    
    setSwipeState(prev => ({
      ...prev,
      distance
    }));
  }, []);
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    };
    
    const distanceX = touchEnd.x - touchStart.current.x;
    const distanceY = touchEnd.y - touchStart.current.y;
    const duration = touchEnd.time - touchStart.current.time;
    
    // Reset state
    setSwipeState({
      isSwiping: false,
      direction: null,
      distance: { x: 0, y: 0 }
    });
    
    // If swipe duration is too long, ignore
    if (duration > maxDuration) {
      touchStart.current = null;
      return;
    }
    
    // Determine if swipe was horizontal or vertical
    const absX = Math.abs(distanceX);
    const absY = Math.abs(distanceY);
    
    // Horizontal swipe
    if (absX > absY && absX > minDistance) {
      if (distanceX > 0) {
        // Right swipe
        setSwipeState(prev => ({ ...prev, direction: 'right' }));
        if (onSwipeRight) onSwipeRight();
      } else {
        // Left swipe
        setSwipeState(prev => ({ ...prev, direction: 'left' }));
        if (onSwipeLeft) onSwipeLeft();
      }
    } 
    // Vertical swipe
    else if (absY > absX && absY > minDistance) {
      if (distanceY > 0) {
        // Down swipe
        setSwipeState(prev => ({ ...prev, direction: 'down' }));
        if (onSwipeDown) onSwipeDown();
      } else {
        // Up swipe
        setSwipeState(prev => ({ ...prev, direction: 'up' }));
        if (onSwipeUp) onSwipeUp();
      }
    }
    
    touchStart.current = null;
  }, [minDistance, maxDuration, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);
  
  const bindSwipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
  
  return {
    swipeState,
    bindSwipeHandlers
  };
}
```

### 3. Mobile Context Menu

We'll create a custom context menu for mobile:

```tsx
// src/components/ui/mobile-context-menu.tsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  actions: Array<{
    icon?: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }>;
  position?: 'top' | 'bottom';
  className?: string;
}

export function MobileContextMenu({
  isOpen,
  onClose,
  actions,
  position = 'bottom',
  className
}: MobileContextMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 tap-highlight-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className={cn(
              "fixed left-4 right-4 z-50 bg-white rounded-xl shadow-lg overflow-hidden",
              position === 'bottom' ? 'bottom-4' : 'top-4',
              className
            )}
            initial={{ 
              opacity: 0,
              y: position === 'bottom' ? 20 : -20 
            }}
            animate={{ 
              opacity: 1,
              y: 0 
            }}
            exit={{ 
              opacity: 0,
              y: position === 'bottom' ? 20 : -20
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={cn(
                    "flex items-center w-full px-4 py-3 text-left rounded-lg",
                    action.variant === 'destructive' 
                      ? "text-red-600 hover:bg-red-50" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => {
                    action.onClick();
                    onClose();
                  }}
                >
                  {action.icon && (
                    <span className="mr-3">{action.icon}</span>
                  )}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-1 border-t">
              <button
                className="flex items-center w-full px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## Form Factor Adaptations

### Phone-Specific Adjustments

For small mobile phones, we'll implement specific optimizations:

```tsx
// src/components/mobile/phone-optimized-quiz.tsx
import React from 'react';
import { useMobileCapabilities } from '../../hooks/useMobileCapabilities';

export function PhoneOptimizedQuiz({ exam, ...props }) {
  const { screenSize, orientation } = useMobileCapabilities();
  const isSmallPhone = screenSize.width < 375;
  
  if (!isSmallPhone) {
    // Regular mobile rendering
    return <StandardMobileQuiz exam={exam} {...props} />;
  }
  
  // Extra compact rendering for small phones
  return (
    <div className="p-2"> {/* Reduced padding */}
      <h2 className="text-base font-medium truncate"> {/* Smaller text */}
        {exam.title}
      </h2>
      
      {/* Compact question display */}
      <div className="mt-2">
        <CompactQuestionCard
          question={props.currentQuestion}
          onSelect={props.onSelectAnswer}
        />
      </div>
      
      {/* Minimal navigation */}
      <CompactNavigation
        currentIndex={props.currentIndex}
        totalQuestions={exam.questions.length}
        onNavigate={props.onNavigate}
      />
    </div>
  );
}

// Smaller components specifically for small phones
function CompactQuestionCard({ question, onSelect }) {
  return (
    <div className="p-3 bg-white rounded-lg shadow-sm">
      <p className="text-sm">{question.text}</p>
      <div className="mt-2 space-y-1">
        {question.options.map((option) => (
          <button
            key={option.id}
            className="w-full text-left p-2 text-xs border rounded hover:bg-blue-50"
            onClick={() => onSelect(option.id)}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Tablet-Specific Adaptations

For tablets, we'll optimize for the larger touch screen area:

```tsx
// src/components/tablet/tablet-optimized-quiz.tsx
import React from 'react';

export function TabletOptimizedQuiz({ exam, ...props }) {
  return (
    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
      {/* Main content area */}
      <div>
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{exam.title}</h2>
            <div className="flex items-center gap-2">
              <TimerDisplay
                timeRemaining={props.timeRemaining}
                onTimeExpired={props.onTimeExpired}
              />
              <ProgressIndicator
                current={props.currentIndex + 1}
                total={exam.questions.length}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <TabletQuestionCard
              question={props.currentQuestion}
              onSelect={props.onSelectAnswer}
              selectedOption={props.selectedOption}
            />
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              onClick={props.onPrevious}
              disabled={props.currentIndex === 0}
            >
              Previous
            </button>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={props.onNext}
              disabled={props.currentIndex === exam.questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="bg-white rounded-lg shadow-md p-4 md:sticky md:top-4 md:self-start">
        <h3 className="font-medium mb-3">Question Navigator</h3>
        <TabletQuestionNavigator
          currentIndex={props.currentIndex}
          totalQuestions={exam.questions.length}
          answeredQuestions={props.answeredQuestions}
          flaggedQuestions={props.flaggedQuestions}
          onNavigate={props.onNavigate}
        />
        
        <div className="mt-4 pt-4 border-t">
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={props.onFinish}
          >
            Finish Exam
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Touch Interaction Enhancements

### 1. Touch Targets

We'll ensure all interactive elements are at least 44×44px for touch:

```tsx
// src/components/ui/touch-button.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function TouchButton({
  variant = 'default',
  size = 'md',
  iconOnly = false,
  className,
  children,
  ...props
}: TouchButtonProps) {
  const sizeClasses = {
    // Minimum 44×44px for touch accessibility
    sm: iconOnly ? 'h-11 w-11 min-h-[44px] min-w-[44px]' : 'h-11 min-h-[44px] px-4',
    md: iconOnly ? 'h-12 w-12 min-h-[48px] min-w-[48px]' : 'h-12 min-h-[48px] px-5',
    lg: iconOnly ? 'h-14 w-14 min-h-[56px] min-w-[56px]' : 'h-14 min-h-[56px] px-6',
  };
  
  const variantClasses = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  };
  
  return (
    <button
      className={cn(
        'flex items-center justify-center font-medium rounded-lg transition-colors text-center',
        'touch-callout-none tap-highlight-transparent',
        sizeClasses[size],
        variantClasses[variant],
        iconOnly && 'p-0',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 2. Touch Feedback

We'll implement consistent touch feedback:

```tsx
// src/hooks/useTouchFeedback.ts
import { useState, useCallback } from 'react';

export function useTouchFeedback() {
  const [isTouched, setIsTouched] = useState(false);
  
  const handleTouchStart = useCallback(() => {
    setIsTouched(true);
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10); // Light touch feedback (10ms)
    }
  }, []);
  
  const handleTouchEnd = useCallback(() => {
    setIsTouched(false);
  }, []);
  
  const bindTouchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
  };
  
  return {
    isTouched,
    bindTouchHandlers
  };
}
```

### 3. Pull-to-Refresh

We'll implement a pull-to-refresh component for mobile:

```tsx
// src/components/ui/pull-to-refresh.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<any>;
  children: React.ReactNode;
  pullDistance?: number;
  refreshText?: string;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  pullDistance = 80,
  refreshText = 'Pull to refresh',
  className
}: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [canRefresh, setCanRefresh] = useState(false);
  
  const startY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spring for smooth animation
  const y = useSpring(0, { stiffness: 400, damping: 40 });
  const opacity = useTransform(y, [0, pullDistance * 0.3, pullDistance], [0, 0.5, 1]);
  const scale = useTransform(y, [0, pullDistance], [0.8, 1]);
  const rotation = useTransform(y, [0, pullDistance * 0.5, pullDistance], [0, 180, 180]);
  
  // Update spring when pullY changes
  useEffect(() => {
    y.set(Math.min(pullY, pullDistance * 1.5));
  }, [pullY, pullDistance, y]);
  
  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only activate when at top of scroll
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    } else {
      startY.current = null;
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null || refreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // Only pull down, not up
    if (diff > 0) {
      // Apply resistance as user pulls further
      const pullWithResistance = Math.pow(diff, 0.8);
      setPullY(pullWithResistance);
      
      // Can refresh if pulled enough
      setCanRefresh(pullWithResistance > pullDistance);
      
      // Prevent native scroll
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = async () => {
    if (canRefresh && !refreshing) {
      setRefreshing(true);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setRefreshing(false);
        setPullY(0);
        setCanRefresh(false);
      }
    } else {
      setPullY(0);
      setCanRefresh(false);
    }
    
    startY.current = null;
  };
  
  return (
    <div 
      className={cn("relative overflow-auto -mx-4 px-4", className)}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div 
        className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none"
        style={{ 
          y, 
          opacity,
        }}
      >
        <div className="bg-white rounded-full shadow-md p-3 flex items-center gap-2">
          <motion.div style={{ rotate: rotation }}>
            {refreshing ? (
              <Loader2Icon className="h-5 w-5 text-blue-600 animate-spin" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 text-blue-600" />
            )}
          </motion.div>
          <motion.span 
            className="text-sm font-medium"
            style={{ scale }}
          >
            {refreshing ? 'Refreshing...' : (canRefresh ? 'Release to refresh' : refreshText)}
          </motion.span>
        </div>
      </motion.div>
      
      {/* Spacer to show pull indicator */}
      {(pullY > 0 || refreshing) && (
        <div style={{ 
          height: Math.max(refreshing ? pullDistance / 2 : pullY / 2, 0),
          transition: refreshing ? 'height 0.2s ease' : undefined
        }} />
      )}
      
      {/* Content */}
      {children}
    </div>
  );
}
```

## Mobile Performance Optimizations

### 1. Virtualized Lists

We'll implement virtualized lists for better performance:

```tsx
// src/components/ui/virtualized-list.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  overscan?: number;
  className?: string;
  estimatedItemCount?: number;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  overscan = 5,
  className,
  estimatedItemCount
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  // Calculate visible items based on scroll position
  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, clientHeight } = containerRef.current;
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan
    );
    
    setVisibleRange({ start: startIndex, end: endIndex });
  }, [items.length, itemHeight, overscan]);
  
  // Update on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      requestAnimationFrame(calculateVisibleRange);
    };
    
    container.addEventListener('scroll', handleScroll);
    
    // Initial calculation
    calculateVisibleRange();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [calculateVisibleRange]);
  
  // Update when items change
  useEffect(() => {
    calculateVisibleRange();
  }, [items, calculateVisibleRange]);
  
  // Render only visible items
  const visibleItems = items.slice(visibleRange.start, visibleRange.end + 1);
  
  // Total height for scrollbar
  const totalHeight = items.length * itemHeight;
  
  // Offset for visible items
  const offsetTop = visibleRange.start * itemHeight;
  
  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
    >
      {/* Spacer to maintain scrollbar size */}
      <div style={{ height: totalHeight }}>
        {/* Container for visible items */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${offsetTop}px)`
          }}
        >
          {visibleItems.map((item, index) => (
            <div 
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 2. Lazy Loading

We'll lazy load components for better initial load times:

```tsx
// src/features/exams/components/lazy-loaded-exam-results.tsx
import React, { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

// Lazy load the heavy components
const ExamResultsCharts = lazy(() => import('./exam-results-charts'));
const DetailedQuestionReview = lazy(() => import('./detailed-question-review'));

export function LazyLoadedExamResults({ result, ...props }) {
  return (
    <div className="space-y-6">
      {/* Always render critical content immediately */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold">Exam Results</h2>
        <div className="mt-4">
          <div className="text-3xl font-bold">
            {result.score}%
          </div>
          <div className="text-sm text-gray-500">
            {result.isPassed ? 'Passed' : 'Failed'}
          </div>
        </div>
      </div>
      
      {/* Lazy load charts */}
      <Suspense fallback={
        <div className="h-64 flex items-center justify-center">
          <Spinner />
        </div>
      }>
        <ExamResultsCharts result={result} />
      </Suspense>
      
      {/* Lazy load detailed review */}
      <Suspense fallback={
        <div className="h-96 flex items-center justify-center">
          <Spinner />
        </div>
      }>
        <DetailedQuestionReview 
          questions={props.questions} 
          answers={result.answers} 
        />
      </Suspense>
    </div>
  );
}
```

### 3. Image Optimization

We'll optimize images for mobile:

```tsx
// src/components/ui/responsive-image.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  optimized?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export function ResponsiveImage({
  src,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  optimized = true,
  className,
  width,
  height
}: ResponsiveImageProps) {
  // For static images, use optimized Next.js Image
  if (optimized) {
    return (
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
        width={width || 1200}
        height={height || 800}
      />
    );
  }
  
  // For dynamic/external images, use regular img tag with source set
  return (
    <picture>
      {/* Tiny image for mobile */}
      <source
        media="(max-width: 640px)"
        srcSet={`${src}?w=640&q=75`}
      />
      {/* Medium image for tablets */}
      <source
        media="(max-width: 1024px)"
        srcSet={`${src}?w=1024&q=80`}
      />
      {/* Large image for desktop */}
      <source
        srcSet={`${src}?w=1920&q=85`}
      />
      <img
        src={src}
        alt={alt}
        className={cn("object-cover", className)}
        loading={priority ? "eager" : "lazy"}
        width={width}
        height={height}
      />
    </picture>
  );
}
```

## Implementation Timeline

### Phase 1: Mobile-First Foundation (2 weeks)

1. **Week 1**: Mobile Utilities and Hooks
   - Implement device detection hooks
   - Create mobile-specific utility classes
   - Set up responsive testing environment
   - Enhance Tailwind configuration for mobile

2. **Week 2**: Core Layout Components
   - Refactor layout components for mobile-first
   - Create responsive navigation patterns
   - Implement bottom sheet component
   - Create touch-optimized buttons

### Phase 2: Exam Experience Components (3 weeks)

3. **Week 3**: Question Display
   - Implement touch-friendly question cards
   - Create swipe navigation between questions
   - Optimize option selection for touch
   - Implement mobile timer component

4. **Week 4**: Navigation and Interaction
   - Create mobile question navigation
   - Implement mobile-specific context menus
   - Add pull-to-refresh functionality
   - Optimize scroll performance

5. **Week 5**: Review and Results
   - Create mobile exam summary view
   - Optimize results visualizations for small screens
   - Implement lazy loading for heavy components
   - Add mobile-specific transitions and animations

### Phase 3: Performance and Testing (1 week)

6. **Week 6**: Optimization and Testing
   - Implement virtualized lists for performance
   - Optimize image loading for mobile
   - Perform cross-device testing
   - Fix device-specific issues

## Conclusion

This UI implementation strategy outlines a comprehensive approach to making the PharmacyHub Exams feature mobile-compatible. By focusing on responsive design patterns, mobile-specific UI components, and performance optimizations, we can deliver a seamless experience across devices.

The strategy prioritizes:
- Mobile-first, responsive layouts
- Touch-optimized interaction
- Performance optimizations for mobile
- Consistent user experience across devices
- Progressive enhancement for advanced capabilities

Following this implementation approach will ensure the exams feature is fully functional and user-friendly on mobile devices, while maintaining the existing desktop experience.
