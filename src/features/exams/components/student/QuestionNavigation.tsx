import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CheckIcon, 
  LifeBuoyIcon, 
  FlagIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ListIcon,
  CheckCircleIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onNavigate: (index: number) => void;
  onFinishExam: () => void;
}

export function QuestionNavigation({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
  onFinishExam
}: QuestionNavigationProps) {
  const [activeTab, setActiveTab] = useState<string>('compact');
  
  // Get question number at specific index
  const getQuestionNumber = (index: number) => index + 1;
  
  // Get question status
  const getQuestionStatus = (index: number) => {
    // The questionId here should match how they're stored in answeredQuestions
    // This assumes the questionIds are stored as actual question IDs from the server
    const questionNumber = index + 1; // Used for index + 1 display
    const questionId = index + 1; // Assuming question IDs also start at 1
    
    // Check if the question ID exists in answeredQuestions
    const isAnswered = answeredQuestions.has(questionId);
    const isFlagged = flaggedQuestions.has(questionId);
    const isCurrent = index === currentIndex;
    
    if (isCurrent) return 'current';
    if (isAnswered && isFlagged) return 'answered-flagged';
    if (isAnswered) return 'answered';
    if (isFlagged) return 'flagged';
    return 'unanswered';
  };
  
  // Get status classes
  const getStatusClasses = (status: string, isCompact = false) => {
    switch (status) {
      case 'current':
        return 'bg-blue-600 text-white border border-blue-700';
      case 'answered':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'flagged':
        return 'bg-amber-100 text-amber-700 border border-amber-300';
      case 'answered-flagged':
        return 'bg-green-100 text-green-700 border border-green-300';
      default:
        return 'bg-white text-gray-800 border border-gray-300';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckIcon className="h-3 w-3" />;
      case 'flagged':
        return <FlagIcon className="h-3 w-3" />;
      case 'answered-flagged':
        return <CheckIcon className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Calculate pagination values
  const currentPage = Math.floor(currentIndex / 10) + 1;
  const totalPages = Math.ceil(totalQuestions / 10);
  const pageStartIdx = (currentPage - 1) * 10;
  const pageEndIdx = Math.min(pageStartIdx + 9, totalQuestions - 1);

  // Navigate to page with specific index
  const goToPage = (page: number) => {
    const newIndex = (page - 1) * 10;
    onNavigate(Math.min(newIndex, totalQuestions - 1));
  };

  // Quick navigation - go to first question
  const goToFirst = () => onNavigate(0);
  
  // Quick navigation - go to last question
  const goToLast = () => onNavigate(totalQuestions - 1);

  // Generate compact grid view
  const renderCompactGrid = () => {
    // Show the vicinity of the current question + some pagination
    const window = 7; // Questions to show around current
    let startIdx = Math.max(0, currentIndex - Math.floor(window/2));
    let endIdx = Math.min(startIdx + window - 1, totalQuestions - 1);
    
    // Adjust if we're near the end
    if (endIdx - startIdx < window - 1) {
      startIdx = Math.max(0, endIdx - (window - 1));
    }
    
    const buttons = [];
    
    // First page button if not at start
    if (startIdx > 0) {
      buttons.push(
        <Button
          key="first"
          variant="outline"
          size="sm"
          onClick={goToFirst}
          className="w-8 h-8 p-0 text-sm rounded-md border border-gray-300"
        >
          1
        </Button>
      );
      
      if (startIdx > 1) {
        buttons.push(
          <span key="ellipsis-start" className="text-xs mx-1 self-center">...</span>
        );
      }
    }
    
    // The vicinity buttons
    for (let i = startIdx; i <= endIdx; i++) {
      const status = getQuestionStatus(i);
      const statusClasses = getStatusClasses(status, true);
      
      buttons.push(
        <Button
          key={i}
          variant="outline"
          size="sm"
          onClick={() => onNavigate(i)}
          className={cn(
            "w-8 h-8 p-0 flex items-center justify-center text-sm rounded-md",
            statusClasses
          )}
        >
          {getQuestionNumber(i)}
        </Button>
      );
    }
    
    // Last page button if not at end
    if (endIdx < totalQuestions - 1) {
      if (endIdx < totalQuestions - 2) {
        buttons.push(
          <span key="ellipsis-end" className="text-xs mx-1">...</span>
        );
      }
      
      buttons.push(
        <Button
          key="last"
          variant="outline"
          size="sm"
          onClick={goToLast}
          className="w-8 h-8 p-0 text-sm rounded-md border border-gray-300"
        >
          {totalQuestions}
        </Button>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {buttons}
      </div>
    );
  };
  
  // Generate 10x10 grid for all questions
  const renderFullGrid = () => {
    // Use a fixed number of columns for better layout
    const questionsPerRow = 10;
    const rows = Math.ceil(totalQuestions / questionsPerRow);
    const grid = [];
    
    for (let row = 0; row < rows; row++) {
      const rowItems = [];
      
      for (let col = 0; col < questionsPerRow; col++) {
        const index = row * questionsPerRow + col;
        if (index >= totalQuestions) {
          // Add empty placeholder to maintain grid structure
          rowItems.push(<div key={`empty-${index}`} className="w-6 h-6"></div>);
          continue;
        }
        
        const status = getQuestionStatus(index);
        const statusClasses = getStatusClasses(status);
        const statusIcon = getStatusIcon(status);
        
        rowItems.push(
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onNavigate(index)}
            className={cn(
              "w-6 h-6 p-0 flex items-center justify-center relative text-xs border",
              statusClasses
            )}
            aria-label={`Go to question ${getQuestionNumber(index)}`}
          >
            {getQuestionNumber(index)}
            {statusIcon && (
              <span className="absolute -top-1 -right-1 text-xs">
                {statusIcon}
              </span>
            )}
          </Button>
        );
      }
      
      grid.push(
        <div key={row} className="flex gap-1 w-full justify-start">
          {rowItems}
        </div>
      );
    }
    
    return (
      <ScrollArea className="h-[210px] rounded-md border p-2">
      <div className="grid grid-cols-1 gap-1 w-full">{grid}</div>
      </ScrollArea>
    );
  };

  // Render pagination stats  
  const renderPaginationStats = () => {
    return (
      <div className="text-sm text-center text-gray-600 mb-2">
        <span className="text-gray-600">{getQuestionNumber(currentIndex)} of {totalQuestions} questions</span>
        {answeredQuestions.size > 0 && (
          <span className="ml-2 text-green-600">
            ({answeredQuestions.size} answered)
          </span>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-2"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Prev
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate(Math.min(totalQuestions - 1, currentIndex + 1))}
          disabled={currentIndex === totalQuestions - 1}
          className="px-2"
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {renderPaginationStats()}
      
      <div className="flex w-full rounded-md overflow-hidden border border-gray-200 mb-1">
        <button
          onClick={() => setActiveTab('compact')}
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'compact' ? 'bg-gray-100' : 'bg-white'}`}
        >
          Compact
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'all' ? 'bg-gray-100' : 'bg-white'}`}
        >
          All Questions
        </button>
      </div>
      
      <div className="mt-2">
        {activeTab === 'compact' ? renderCompactGrid() : renderFullGrid()}
      </div>
      
      <div className="border-t border-gray-200 pt-2 mt-2">
        <Button 
          onClick={onFinishExam}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          variant="default"
        >
          <LifeBuoyIcon className="h-4 w-4 mr-2" />
          Review & Finish
        </Button>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs">Answered</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
            <span className="text-xs">Flagged</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
            <span className="text-xs">Unanswered</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
            <span className="text-xs">Current</span>
          </div>
        </div>
      </div>
    </div>
  );
}