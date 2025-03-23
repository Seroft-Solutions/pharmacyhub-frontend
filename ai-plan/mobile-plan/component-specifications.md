# PharmacyHub Exams Feature - Mobile Component Specifications

This document provides detailed specifications for the mobile-optimized components needed to implement the exams feature mobile compatibility plan.

## New Components

### 1. MobileExamContainer

**Purpose:** Main container component that adapts the exam experience for mobile devices.

**Features:**
- Stacked layout for mobile screens
- Conditional rendering of navigation based on viewport
- Context provider for mobile capabilities
- Handles mobile-specific events (orientation changes, etc.)

**Props:**
```typescript
interface MobileExamContainerProps {
  examId: number;
  userId: string;
  onExit?: () => void;
  showTimer?: boolean;
  initialView?: 'question' | 'summary' | 'results';
  allowOffline?: boolean;
  mobileOptions?: {
    showBottomNav?: boolean;
    enableSwipeNavigation?: boolean;
    enableHapticFeedback?: boolean;
    compactMode?: boolean;
  };
}
```

**States:**
- Loading
- Error
- Ready
- Submitting
- Completed

**Component Structure:**
```tsx
function MobileExamContainer(props: MobileExamContainerProps) {
  const { isMobile, orientation } = useMobileCapabilities();
  const [navSheetOpen, setNavSheetOpen] = useState(false);
  
  // Example conditional rendering based on mobile state
  if (!isMobile) {
    // Render desktop version
    return <ExamContainer {...props} />;
  }
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header with timer */}
      <MobileExamHeader 
        examTitle={exam.title}
        timeRemaining={timeRemaining}
        onExit={handleExit}
      />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto pb-16">
        <TouchOptimizedQuestionCard 
          question={currentQuestion}
          userAnswer={answers[currentQuestion.id]}
          isFlagged={isFlagged(currentQuestion.id)}
          onAnswerSelect={handleAnswerSelect}
          onFlagQuestion={handleToggleFlag}
        />
      </div>
      
      {/* Bottom navigation */}
      <MobileExamNavigation
        currentQuestion={currentQuestionIndex}
        totalQuestions={questions.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFlag={() => handleToggleFlag(currentQuestion.id)}
        onOpenNavigation={() => setNavSheetOpen(true)}
        isFlagged={isFlagged(currentQuestion.id)}
      />
      
      {/* Question navigation bottom sheet */}
      <MobileBottomSheet
        isOpen={navSheetOpen}
        onClose={() => setNavSheetOpen(false)}
        snapPoints={['25%', '50%', '90%']}
      >
        <MobileQuestionGrid
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          answeredQuestions={new Set(Object.keys(answers).map(Number))}
          flaggedQuestions={flaggedQuestions}
          onNavigate={(index) => {
            handleNavigateToQuestion(index);
            setNavSheetOpen(false);
          }}
        />
      </MobileBottomSheet>
    </div>
  );
}
```

### 2. MobileBottomSheet

**Purpose:** Sliding bottom sheet for mobile navigation and options.

**Features:**
- Multiple snap points (25%, 50%, 90%)
- Draggable with touch gestures
- Backdrop for closing
- Focus trapping for accessibility

**Props:**
```typescript
interface MobileBottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: string[];
  initialSnapPoint?: number;
  allowClose?: boolean;
  showDragHandle?: boolean;
  title?: string;
  height?: string;
  className?: string;
}
```

**States:**
- Closed
- Peek
- Half-open
- Full-open

**Component Structure:**
```tsx
function MobileBottomSheet({
  children,
  isOpen,
  onClose,
  snapPoints = ['25%', '50%', '90%'],
  initialSnapPoint = 0,
  allowClose = true,
  showDragHandle = true,
  title,
  height,
  className
}: MobileBottomSheetProps) {
  const [activeSnapPoint, setActiveSnapPoint] = useState(snapPoints[initialSnapPoint]);
  
  // Implementation would use a gesture library like framer-motion
  // or react-spring for smooth animations
  
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={allowClose ? onClose : undefined}
        />
      )}
      
      {/* Sheet */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-50 transition-transform",
          isOpen ? "translate-y-0" : "translate-y-full",
          className
        )}
        style={{ height: height || activeSnapPoint }}
      >
        {/* Drag handle */}
        {showDragHandle && (
          <div className="p-2 text-center border-b">
            <div className="mx-auto w-10 h-1 bg-gray-300 rounded-full" />
          </div>
        )}
        
        {/* Optional title */}
        {title && (
          <div className="px-4 py-2 border-b">
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-auto p-4 h-full">
          {children}
        </div>
      </div>
    </>
  );
}
```

### 3. TouchOptimizedQuestionCard

**Purpose:** Question display component optimized for touch interactions.

**Features:**
- Larger touch targets for options
- Touch feedback animations
- Mobile-optimized spacing
- Swipe support for navigation

**Props:**
```typescript
interface TouchOptimizedQuestionCardProps {
  question: Question;
  userAnswer?: number;
  isFlagged?: boolean;
  onAnswerSelect: (questionId: number, optionIndex: number) => void;
  onFlagQuestion: (questionId: number) => void;
  enableSwipe?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  showExplanation?: boolean;
}
```

**Component Structure:**
```tsx
function TouchOptimizedQuestionCard({
  question,
  userAnswer,
  isFlagged = false,
  onAnswerSelect,
  onFlagQuestion,
  enableSwipe = false,
  onSwipeLeft,
  onSwipeRight,
  showExplanation = false
}: TouchOptimizedQuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    userAnswer?.toString()
  );
  
  // Use swipe hook if enabled
  const swipeHandlers = enableSwipe 
    ? useSwipeNavigation({
        onNext: onSwipeLeft,
        onPrevious: onSwipeRight
      })
    : null;
  
  return (
    <Card 
      className="w-full shadow-md border border-gray-100 rounded-xl overflow-hidden"
      {...(swipeHandlers?.bindSwipeHandlers || {})}
    >
      <CardHeader className="pb-2 border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-blue-600 text-white text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-sm">
              {question.questionNumber || question.id}
            </span>
            <CardTitle className="text-lg font-semibold text-blue-700">
              Question
            </CardTitle>
          </div>
          <Button 
            variant={isFlagged ? "secondary" : "ghost"}
            size="sm" 
            onClick={() => onFlagQuestion(question.id)}
            className={cn(
              "rounded-lg h-10 w-10",
              isFlagged 
                ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200" 
                : "text-gray-500"
            )}
            aria-label={isFlagged ? "Unflag question" : "Flag question for review"}
          >
            <FlagIcon className={cn(
              "h-5 w-5",
              isFlagged ? "text-amber-500" : "text-gray-500"
            )} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium leading-7 text-gray-800">
            {question.text}
          </h3>
        </div>

        <div className="space-y-3 mt-4">
          {question.options.map((option, index) => (
            <TouchOptimizedOption
              key={index}
              option={option}
              index={index}
              isSelected={selectedOption === index.toString()}
              onSelect={() => {
                setSelectedOption(index.toString());
                onAnswerSelect(question.id, index);
              }}
              isCorrect={showExplanation ? option.isCorrect : undefined}
            />
          ))}
        </div>
        
        {/* Explanation section shown conditionally */}
        {showExplanation && question.explanation && (
          <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50 shadow-inner">
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Explanation</h4>
                <p className="text-blue-700">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Touch-optimized option component
function TouchOptimizedOption({
  option,
  index,
  isSelected,
  onSelect,
  isCorrect
}) {
  // Track touch for feedback
  const [isTouched, setIsTouched] = useState(false);
  
  // Letter label (A, B, C, etc.)
  const optionLetter = String.fromCharCode(65 + index);
  
  // Determine styling based on selection and correctness
  let optionClassName = "flex items-center space-x-3 border p-4 rounded-lg transition-all duration-200";
  
  if (isCorrect !== undefined) {
    // Show correctness when explanation is visible
    if (isCorrect) {
      optionClassName = cn(optionClassName, "border-green-500 bg-green-50 shadow-md");
    } else if (isSelected) {
      optionClassName = cn(optionClassName, "border-red-500 bg-red-50 shadow-md");
    }
  } else if (isSelected) {
    // Standard selected styling
    optionClassName = cn(optionClassName, "border-blue-500 bg-blue-50/50 shadow-md");
  } else {
    // Default unselected styling
    optionClassName = cn(optionClassName, "hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm");
  }
  
  return (
    <div 
      className={cn(optionClassName, isTouched && !isSelected ? "bg-gray-100" : "")}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => {
        setIsTouched(false);
        onSelect();
      }}
      onClick={onSelect}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
    >
      <div className="flex items-center space-x-3 w-full">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
          isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
        )}>
          {optionLetter}
        </div>
        <div className="flex-grow flex items-center">
          <Label 
            className="flex-grow text-base pl-2"
          >
            {option.text}
          </Label>
        </div>
        
        {isCorrect !== undefined ? (
          isCorrect ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : isSelected ? (
            <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
          ) : null
        ) : isSelected && (
          <CheckCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
```

### 4. MobileExamNavigation

**Purpose:** Bottom navigation bar with primary exam controls.

**Features:**
- Fixed position at viewport bottom
- Primary actions (next, previous, flag, summary)
- Compact status display
- Touch-friendly buttons

**Props:**
```typescript
interface MobileExamNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  onOpenNavigation: () => void;
  onSubmit?: () => void;
  isFlagged: boolean;
  isLastQuestion?: boolean;
  showSubmit?: boolean;
}
```

**Component Structure:**
```tsx
function MobileExamNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onFlag,
  onOpenNavigation,
  onSubmit,
  isFlagged,
  isLastQuestion = false,
  showSubmit = false
}: MobileExamNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2 safe-area-bottom">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          aria-label="Previous question"
          className="h-12 w-12 rounded-full"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Button>
        
        <Button
          variant="outline"
          onClick={onOpenNavigation}
          className="px-4 py-2 text-sm rounded-full"
          aria-label="Open question navigation"
        >
          <div className="flex items-center">
            <span className="font-medium">{currentQuestion + 1}</span>
            <span className="mx-1 text-gray-400">/</span>
            <span>{totalQuestions}</span>
            <MapIcon className="h-4 w-4 ml-2" />
          </div>
        </Button>
        
        <Button 
          variant={isFlagged ? "secondary" : "ghost"}
          size="icon" 
          onClick={onFlag}
          aria-label={isFlagged ? "Unflag question" : "Flag question for review"}
          className={cn(
            "h-12 w-12 rounded-full",
            isFlagged && "bg-amber-50 text-amber-600 border border-amber-200"
          )}
        >
          <FlagIcon className={cn(
            "h-5 w-5",
            isFlagged ? "text-amber-500" : "text-gray-500"
          )} />
        </Button>
        
        {showSubmit || isLastQuestion ? (
          <Button 
            variant="default" 
            onClick={onSubmit}
            aria-label="Submit exam"
            className="h-12 px-4 rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <span className="mr-1">Submit</span>
            <CheckIcon className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNext}
            disabled={currentQuestion === totalQuestions - 1}
            aria-label="Next question"
            className="h-12 w-12 rounded-full"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
```

### 5. ResponsiveExamTimer

**Purpose:** Timer component that adapts to screen size and visibility needs.

**Features:**
- Compact/expanded variants
- Minimizable on mobile
- Clear warning states
- Configurable position

**Props:**
```typescript
interface ResponsiveExamTimerProps {
  durationInMinutes: number;
  onTimeExpired: () => void;
  isCompleted?: boolean;
  showCompact?: boolean;
  initiallyMinimized?: boolean; 
  position?: 'top' | 'bottom' | 'floating';
  showWarningAt?: number; // seconds
  className?: string;
}
```

**States:**
- Normal
- Warning (< 25% time remaining)
- Critical (< 10% time remaining)
- Expired
- Minimized

**Component Structure:**
```tsx
function ResponsiveExamTimer({
  durationInMinutes,
  onTimeExpired,
  isCompleted = false,
  showCompact = false,
  initiallyMinimized = false,
  position = 'top',
  showWarningAt = 300, // 5 minutes
  className
}: ResponsiveExamTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60);
  const [isMinimized, setIsMinimized] = useState(initiallyMinimized);
  
  // Timer logic (simplified)
  useEffect(() => {
    if (isCompleted || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining, isCompleted, onTimeExpired]);
  
  // Get time display
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;
  
  // Determine timer state
  const timerState = 
    timeRemaining === 0 ? 'expired' :
    timeRemaining < (durationInMinutes * 60 * 0.1) ? 'critical' :
    timeRemaining < showWarningAt ? 'warning' :
    'normal';
  
  // Get color based on state
  const getColorByState = () => {
    switch (timerState) {
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };
  
  // Position classes
  const positionClasses = {
    top: 'sticky top-0 z-10',
    bottom: 'sticky bottom-0 z-10',
    floating: 'fixed top-4 right-4 z-50'
  };
  
  // If minimized, show compact floating button
  if (isMinimized) {
    return (
      <Button
        variant="outline"
        className="fixed top-4 right-4 z-50 p-2 min-w-0 h-auto shadow-md border"
        onClick={() => setIsMinimized(false)}
      >
        <ClockIcon className="h-4 w-4" />
        <span className="ml-1 text-sm font-medium">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </Button>
    );
  }
  
  // Full timer display
  if (showCompact) {
    // Compact view
    return (
      <div className={cn(
        "flex items-center justify-between px-3 py-2 border rounded-lg",
        getColorByState(),
        positionClasses[position],
        className
      )}>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span className="font-mono text-lg font-medium">
            {hours > 0 ? `${hours}:` : ''}
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setIsMinimized(true)}
        >
          <MinimizeIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  // Full featured timer
  return (
    <div className={cn(
      "flex items-center justify-between p-4 border rounded-lg",
      getColorByState(),
      positionClasses[position],
      className
    )}>
      <div className="flex items-center">
        <div className={cn(
          "p-2 rounded-full mr-3",
          timerState === 'normal' ? 'bg-blue-100' :
          timerState === 'warning' ? 'bg-amber-100' :
          'bg-red-100'
        )}>
          <ClockIcon className={cn(
            "h-5 w-5",
            timerState === 'normal' ? 'text-blue-600' :
            timerState === 'warning' ? 'text-amber-600' :
            'text-red-600'
          )} />
        </div>
        
        <div>
          <div className="text-xs font-medium mb-0.5">Time Remaining</div>
          <div className="font-mono text-xl font-bold">
            {hours > 0 ? `${hours}:` : ''}
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8"
        onClick={() => setIsMinimized(true)}
      >
        <MinimizeIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### 6. MobileQuestionGrid

**Purpose:** Touch-optimized question grid for navigation.

**Features:**
- Horizontal scrolling for question numbers
- Larger touch targets
- Visual status indicators
- Compact/expanded modes

**Props:**
```typescript
interface MobileQuestionGridProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onNavigate: (index: number) => void;
  questions?: any[];
  mode?: 'compact' | 'grid' | 'list';
}
```

**Component Structure:**
```tsx
function MobileQuestionGrid({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
  questions = [],
  mode = 'grid'
}: MobileQuestionGridProps) {
  // Get question status
  const getQuestionStatus = (index: number) => {
    // Calculate the question number (1-based index for display)
    const questionNumber = index + 1;

    // Check if this is the current question
    const isCurrent = index === currentIndex;
    
    // Check if this question is answered
    let isAnswered = false;
    
    // Convert answeredQuestions Set to Array for easier searching
    const answeredArray = Array.from(answeredQuestions);
    
    // Loop through all answered questions and check if any match this question
    for (const answeredId of answeredArray) {
      // Check if the answeredId directly matches the question number
      if (answeredId === questionNumber) {
        isAnswered = true;
        break;
      }
      
      // Try matching by index in questions array if possible
      if (questions && questions[index] && questions[index].id === answeredId) {
        isAnswered = true;
        break;
      }
    }
    
    // Same approach for flagged questions
    let isFlagged = false;
    const flaggedArray = Array.from(flaggedQuestions);
    
    for (const flaggedId of flaggedArray) {
      if (flaggedId === questionNumber) {
        isFlagged = true;
        break;
      }
      
      if (questions && questions[index] && questions[index].id === flaggedId) {
        isFlagged = true;
        break;
      }
    }
    
    // Determine status based on combinations
    if (isCurrent) return 'current';
    if (isAnswered && isFlagged) return 'answered-flagged';
    if (isAnswered) return 'answered';
    if (isFlagged) return 'flagged';
    return 'unanswered';
  };
  
  // Get button classes based on status
  const getButtonClasses = (status: string) => {
    const baseClasses = "flex items-center justify-center rounded-lg transition-all duration-200";
    
    switch (status) {
      case 'current':
        return cn(baseClasses, "bg-blue-600 text-white shadow-md ring-2 ring-blue-300 transform scale-110");
      case 'answered':
        return cn(baseClasses, "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200");
      case 'flagged':
        return cn(baseClasses, "bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200");
      case 'answered-flagged':
        return cn(baseClasses, "bg-green-100 text-green-700 border-2 border-amber-400 hover:bg-green-200");
      default:
        return cn(baseClasses, "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-400");
    }
  };
  
  // Compact mode with horizontal scrolling
  if (mode === 'compact') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5" />
              <span className="text-sm font-medium">{answeredQuestions.size}/{totalQuestions}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200">
              <FlagIcon className="h-4 w-4 text-amber-500 mr-1.5" />
              <span className="text-sm font-medium">{flaggedQuestions.size}</span>
            </div>
          </div>
        </div>
        
        <ScrollArea orientation="horizontal" className="w-full pb-4">
          <div className="flex gap-2 p-1 min-w-max">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  className={cn(
                    getButtonClasses(status),
                    "h-12 w-12 text-base font-medium"
                  )}
                  onClick={() => onNavigate(index)}
                  aria-label={`Go to question ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }
  
  // Grid view
  if (mode === 'grid') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5" />
              <span className="text-sm font-medium">{answeredQuestions.size}/{totalQuestions}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200">
              <FlagIcon className="h-4 w-4 text-amber-500 mr-1.5" />
              <span className="text-sm font-medium">{flaggedQuestions.size}</span>
            </div>
          </div>
        </div>
      
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const status = getQuestionStatus(index);
            return (
              <button
                key={index}
                className={cn(
                  getButtonClasses(status),
                  "h-12 w-full text-base font-medium"
                )}
                onClick={() => onNavigate(index)}
                aria-label={`Go to question ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      
        {/* Legend */}
        <div className="mt-4 bg-gray-50 p-2 rounded-lg text-xs flex flex-wrap justify-between gap-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-600 mr-1.5"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></div>
            <span>Flagged</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-1.5"></div>
            <span>Unanswered</span>
          </div>
        </div>
      </div>
    );
  }
  
  // List view
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <span className="font-medium">{answeredQuestions.size}/{totalQuestions} answered</span>
        </div>
        <div className="flex items-center gap-2">
          <FlagIcon className="h-5 w-5 text-amber-500" />
          <span className="font-medium">{flaggedQuestions.size} flagged</span>
        </div>
      </div>
    
      <div className="space-y-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const status = getQuestionStatus(index);
          const statusText = 
            status === 'current' ? 'Current' :
            status === 'answered' ? 'Answered' :
            status === 'flagged' ? 'Flagged' :
            status === 'answered-flagged' ? 'Answered & Flagged' :
            'Unanswered';
          
          const statusIcon = 
            status === 'current' ? <ArrowRightIcon className="h-5 w-5 text-blue-500" /> :
            status === 'answered' ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> :
            status === 'flagged' ? <FlagIcon className="h-5 w-5 text-amber-500" /> :
            status === 'answered-flagged' ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> :
            <CircleIcon className="h-5 w-5 text-gray-300" />;
            
          return (
            <button
              key={index}
              className={cn(
                "flex items-center justify-between w-full p-3 rounded-lg border",
                status === 'current' ? "bg-blue-50 border-blue-300" :
                status === 'answered' ? "bg-green-50 border-green-200" :
                status === 'flagged' ? "bg-amber-50 border-amber-200" :
                status === 'answered-flagged' ? "bg-green-50 border-amber-300" :
                "bg-white border-gray-200"
              )}
              onClick={() => onNavigate(index)}
            >
              <div className="flex items-center">
                <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm mr-3 font-medium border border-gray-200">
                  {index + 1}
                </div>
                <span>{statusText}</span>
              </div>
              {statusIcon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

## Modified Components

The following existing components will need to be modified to support mobile devices:

### 1. ExamContainer.tsx

**Changes Required:**
- Add a check for mobile viewport
- Conditionally render MobileExamContainer on small screens
- Pass mobile-specific props to child components
- Ensure proper state sharing between desktop/mobile views

**Implementation Example:**
```tsx
import { useMobileCapabilities } from '../../hooks/useMobileCapabilities';
import { MobileExamContainer } from './MobileExamContainer';

// Modified ExamContainer component
function ExamContainer(props: ExamContainerProps) {
  const { isMobile } = useMobileCapabilities();
  
  // For mobile devices, use the mobile-optimized container
  if (isMobile) {
    return <MobileExamContainer {...props} />;
  }
  
  // Existing desktop implementation
  // ...rest of the component remains the same
}
```

### 2. QuestionDisplay.tsx

**Changes Required:**
- Increase touch target sizes
- Optimize spacing for mobile viewport
- Ensure text is readable without zooming
- Consider adding swipe navigation

**Implementation Example:**
```tsx
// Update to use the TouchOptimizedOption component for selection
function QuestionDisplay({
  question,
  userAnswer,
  isFlagged = false,
  onAnswerSelect,
  onFlagQuestion,
}: QuestionDisplayProps) {
  const { isMobile } = useMobileCapabilities();
  
  // If on mobile, use larger touch targets
  const optionComponent = isMobile
    ? <TouchOptimizedOption
        key={index}
        option={option}
        index={index}
        isSelected={userAnswer === index}
        onSelect={() => onAnswerSelect(question.id, index)}
      />
    : <StandardOption
        key={index}
        option={option}
        index={index}
        isSelected={userAnswer === index}
        onSelect={() => onAnswerSelect(question.id, index)}
      />;
}
```

### 3. ExamLayout.tsx

**Changes Required:**
- Adjust layout for stacked vs. side-by-side based on screen size
- Ensure sidebars collapse/expand appropriately on mobile
- Handle orientation changes

**Implementation Example:**
```tsx
function ExamLayout({ children }: { children: React.ReactNode }) {
  const { isMobile, orientation } = useMobileCapabilities();
  
  return (
    <div className={cn(
      "exam-layout",
      isMobile
        ? "flex flex-col" 
        : "grid grid-cols-[1fr_auto] gap-4"
    )}>
      {/* The main content area */}
      <main className={cn(
        "min-h-screen",
        isMobile && "pb-16" // Add padding for bottom navigation
      )}>
        {children}
      </main>
      
      {/* Don't render sidebar on mobile - use bottom navigation instead */}
      {!isMobile && (
        <aside className="w-72 border-l bg-gray-50">
          <SideNavigation />
        </aside>
      )}
    </div>
  );
}
```

### 4. ExamSummary.tsx

**Changes Required:**
- Simplify layout for mobile screens
- Use accordions for section grouping
- Ensure action buttons are easily accessible

**Implementation Example:**
```tsx
function ExamSummary(props: ExamSummaryProps) {
  const { isMobile } = useMobileCapabilities();
  
  // Render a more compact summary for mobile
  if (isMobile) {
    return (
      <div className="space-y-4 pb-16">
        <SummaryHeader 
          answeredCount={props.answeredQuestionIds.size}
          totalQuestions={props.questions.length}
        />
        
        <Accordion type="single" collapsible>
          <AccordionItem value="answered">
            <AccordionTrigger>
              Answered Questions ({props.answeredQuestionIds.size})
            </AccordionTrigger>
            <AccordionContent>
              <MobileAnsweredList 
                questions={props.questions}
                answeredIds={props.answeredQuestionIds}
                onNavigate={props.onNavigateToQuestion}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="flagged">
            <AccordionTrigger>
              Flagged Questions ({props.flaggedQuestionIds.size})
            </AccordionTrigger>
            <AccordionContent>
              <MobileFlaggedList 
                questions={props.questions}
                flaggedIds={props.flaggedQuestionIds}
                onNavigate={props.onNavigateToQuestion}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="unanswered">
            <AccordionTrigger>
              Unanswered Questions ({props.questions.length - props.answeredQuestionIds.size})
            </AccordionTrigger>
            <AccordionContent>
              <MobileUnansweredList 
                questions={props.questions}
                answeredIds={props.answeredQuestionIds}
                onNavigate={props.onNavigateToQuestion}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <Button 
            onClick={props.onSubmitExam}
            className="w-full py-6"
            size="lg"
          >
            Submit Exam
          </Button>
        </div>
      </div>
    );
  }
  
  // Existing desktop implementation remains unchanged
  // ...rest of the component
}
```

### 5. ExamResults.tsx

**Changes Required:**
- Optimize visualizations for mobile screens
- Use responsive charts and graphs
- Simplify data presentation on small screens

**Implementation Example:**
```tsx
function ExamResults(props: ExamResultsProps) {
  const { isMobile } = useMobileCapabilities();
  
  // Use simplified charts for mobile
  const resultCharts = isMobile
    ? <MobileResultVisualizations result={props.result} />
    : <DesktopResultVisualizations result={props.result} />;
    
  return (
    <div className={cn(
      "space-y-6",
      isMobile && "pb-16" // Space for bottom action bar
    )}>
      <ResultsHeader 
        score={props.result.score}
        isPassed={props.result.isPassed}
        compact={isMobile}
      />
      
      {resultCharts}
      
      {/* Conditionally render detailed tables based on screen size */}
      {!isMobile && <DetailedResultsTables {...props} />}
      
      {/* Mobile-specific action buttons */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={props.onReview}
            >
              Review Answers
            </Button>
            <Button onClick={props.onTryAgain}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Custom Hooks

### 1. useMobileCapabilities

```typescript
/**
 * Custom hook for detecting mobile capabilities and environment
 */
function useMobileCapabilities() {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [touchSupport, setTouchSupport] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  useEffect(() => {
    // Check for mobile using window.innerWidth
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Typical tablet breakpoint
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };
    
    // Check for touch support
    setTouchSupport('ontouchstart' in window);
    
    // Set initial values
    checkMobile();
    
    // Add listeners for resize and orientation change
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);
  
  return { 
    isMobile, 
    orientation, 
    touchSupport,
    screenSize,
    // Helpers
    isSmallMobile: screenSize.width < 375,
    isMediumMobile: screenSize.width >= 375 && screenSize.width < 480,
    isLargeMobile: screenSize.width >= 480 && screenSize.width < 640,
    isTablet: screenSize.width >= 768 && screenSize.width < 1024
  };
}
```

### 2. useSwipeNavigation

```typescript
/**
 * Custom hook for handling swipe navigation between items
 */
function useSwipeNavigation({
  onNext,
  onPrevious,
  isFirstItem,
  isLastItem
}: {
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstItem?: boolean;
  isLastItem?: boolean;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  // Required minimum distance traveled to be considered a swipe
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsActive(true);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    setIsActive(false);
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && !isLastItem && onNext) {
      setSwipeDirection('left');
      onNext();
    } else if (isRightSwipe && !isFirstItem && onPrevious) {
      setSwipeDirection('right');
      onPrevious();
    }
    
    // Reset swipe direction after a short delay
    setTimeout(() => setSwipeDirection(null), 300);
  };
  
  const bindSwipeHandlers = {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
  
  return {
    bindSwipeHandlers,
    swipeDirection,
    isActive
  };
}
```

### 3. useOfflineSync

```typescript
/**
 * Custom hook for handling offline data synchronization
 */
function useOfflineSync<T>({
  key,
  initialData,
  syncFunction,
  onSyncSuccess,
  onSyncError
}: {
  key: string;
  initialData: T;
  syncFunction: (data: T) => Promise<any>;
  onSyncSuccess?: (result: any) => void;
  onSyncError?: (error: any) => void;
}) {
  const [data, setData] = useState<T>(initialData);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueue, setSyncQueue] = useState<T[]>([]);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  
  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`offlineSync_${key}`);
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
    
    // Load sync queue
    const savedQueue = localStorage.getItem(`offlineSync_queue_${key}`);
    if (savedQueue) {
      try {
        setSyncQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error('Failed to parse sync queue:', e);
      }
    }
  }, [key]);
  
  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processSyncQueue();
    };
    
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Process the sync queue when online
  const processSyncQueue = async () => {
    if (!isOnline || isSyncing || syncQueue.length === 0) return;
    
    setIsSyncing(true);
    
    try {
      // Process each item in the queue
      const itemToSync = syncQueue[0];
      const result = await syncFunction(itemToSync);
      
      // Remove the successfully synced item from queue
      const newQueue = [...syncQueue.slice(1)];
      setSyncQueue(newQueue);
      localStorage.setItem(`offlineSync_queue_${key}`, JSON.stringify(newQueue));
      
      // Update last synced timestamp
      setLastSynced(new Date());
      
      // Callback for success
      if (onSyncSuccess) {
        onSyncSuccess(result);
      }
      
      // Continue processing the queue if there are more items
      if (newQueue.length > 0) {
        setTimeout(() => processSyncQueue(), 1000);
      }
    } catch (error) {
      if (onSyncError) {
        onSyncError(error);
      }
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Update data and queue it for syncing if offline
  const updateData = (newData: T) => {
    // Save locally
    setData(newData);
    localStorage.setItem(`offlineSync_${key}`, JSON.stringify(newData));
    
    // If online, sync immediately
    if (isOnline && !isSyncing) {
      setIsSyncing(true);
      syncFunction(newData)
        .then((result) => {
          setLastSynced(new Date());
          if (onSyncSuccess) onSyncSuccess(result);
        })
        .catch((error) => {
          // If sync fails, add to queue
          const newQueue = [...syncQueue, newData];
          setSyncQueue(newQueue);
          localStorage.setItem(`offlineSync_queue_${key}`, JSON.stringify(newQueue));
          
          if (onSyncError) onSyncError(error);
        })
        .finally(() => setIsSyncing(false));
    } else {
      // If offline, add to queue for later syncing
      const newQueue = [...syncQueue, newData];
      setSyncQueue(newQueue);
      localStorage.setItem(`offlineSync_queue_${key}`, JSON.stringify(newQueue));
    }
  };
  
  return {
    data,
    updateData,
    isOnline,
    isSyncing,
    syncQueue,
    lastSynced,
    syncNow: processSyncQueue
  };
}
```

These detailed component specifications provide the foundation for implementing the mobile compatibility plan, ensuring consistency and comprehensiveness across the development effort.
