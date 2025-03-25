"use client";

import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  CheckCircleIcon,
  MapIcon,
  HelpCircleIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

// Break down into smaller components
const QuestionStatusLegend = ({ isMobile }) => {
  return (
    <div className={`bg-gray-50 ${isMobile ? 'p-1.5 text-[10px]' : 'p-2 text-xs'} rounded-lg flex flex-wrap justify-between gap-1`}>
      <div className="flex items-center">
        <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-blue-600 mr-1`}></div>
        <span>Current</span>
      </div>
      <div className="flex items-center">
        <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-green-500 mr-1`}></div>
        <span>Answered</span>
      </div>
      <div className="flex items-center">
        <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-amber-500 mr-1`}></div>
        <span>Flagged</span>
      </div>
      <div className="flex items-center">
        <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-gray-300 mr-1`}></div>
        <span>Unanswered</span>
      </div>
    </div>
  );
};

const QuestionButton = ({ index, status, onNavigate, getQuestionNumber, getStatusIcon, isMobile }) => {
  return (
    <div className="relative">
      <button
        className={getButtonClasses(status, isMobile)}
        onClick={() => onNavigate(index)}
        aria-label={`Go to question ${getQuestionNumber(index)}`}
      >
        {getQuestionNumber(index)}
      </button>
      
      {/* Status Indicator */}
      {status !== 'current' && status !== 'unanswered' && (
        <span className={`absolute ${isMobile ? '-top-0.5 -right-0.5' : '-top-1 -right-1'}`}>
          {getStatusIcon(status, isMobile ? 10 : 14)}
        </span>
      )}
    </div>
  );
};

// Get color classes for question buttons
const getButtonClasses = (status: string, isMobile: boolean) => {
  const baseClasses = `flex items-center justify-center ${isMobile ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'} font-medium rounded-lg transition-all duration-200`;
  
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

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onNavigate: (index: number) => void;
  onFinishExam: () => void;
  onDirectSubmit?: () => void; // New prop for direct submission flow
  questions?: any[]; // Add this to receive the questions array
}

export function QuestionNavigation({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
  onFinishExam,
  onDirectSubmit,
  questions = [] // Default to empty array if not provided
}: QuestionNavigationProps) {
  const [activeTab, setActiveTab] = useState<string>('compact');
  const isMobile = useMobileStore(selectIsMobile);
  
  // Get question number at specific index
  const getQuestionNumber = (index: number) => index + 1;
  
  // Get question status
  const getQuestionStatus = (index: number) => {
    // Calculate the question number (1-based index for display)
    const questionNumber = index + 1;

    // Check if this is the current question
    const isCurrent = index === currentIndex;
    
    // Check if this question is answered - try multiple ways to match
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
  
  // Get icon for question status
  const getStatusIcon = (status: string, size = 14) => {
    switch (status) {
      case 'answered':
        return <CheckCircleIcon className={`h-${size/4} w-${size/4} text-green-500`} />;
      case 'flagged':
        return <FlagIcon className={`h-${size/4} w-${size/4} text-amber-500`} />;
      case 'answered-flagged':
        return <FlagIcon className={`h-${size/4} w-${size/4} text-amber-500`} />;
      case 'current':
        return <HelpCircleIcon className={`h-${size/4} w-${size/4} text-blue-100`} />;
      default:
        return null;
    }
  };

  // Generate compact grid view (1-2 rows of numbers with paging)
  const renderCompactGrid = () => {
    const itemsPerPage = isMobile ? 5 : 10;
    const currentPage = Math.floor(currentIndex / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalQuestions - 1);
    
    return (
      <div className={`space-y-${isMobile ? '3' : '4'}`}>
        {/* Progress Summary */}
        <div className={`flex justify-between items-center bg-gray-50 ${isMobile ? 'p-2' : 'p-3'} rounded-lg`}>
          <div className="flex items-center gap-2">
            <div className={`flex items-center bg-white ${isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1'} rounded-md shadow-sm border border-gray-200`}>
              <CheckCircleIcon className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1.5'} text-green-500`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{answeredQuestions.size}/{totalQuestions}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center bg-white ${isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1'} rounded-md shadow-sm border border-gray-200`}>
              <FlagIcon className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1.5'} text-amber-500`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{flaggedQuestions.size}</span>
            </div>
          </div>
        </div>
        
        {/* Pager Controls */}
        <div className={`flex justify-center gap-${isMobile ? '1' : '2'} items-center bg-white ${isMobile ? 'p-1.5' : 'p-2'} rounded-lg border border-gray-200 shadow-sm`}>
          <Button 
            variant="outline" 
            size={isMobile ? "xs" : "icon"} 
            className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full`} 
            onClick={() => onNavigate(0)}
            disabled={currentIndex === 0}
          >
            <ChevronsLeftIcon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
          </Button>
          <Button 
            variant="outline" 
            size={isMobile ? "xs" : "icon"} 
            className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full`} 
            onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeftIcon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
          </Button>
          
          <div className={`mx-1 ${isMobile ? 'text-xs' : 'text-sm'} font-medium bg-gray-50 ${isMobile ? 'px-2 py-0.5' : 'px-3 py-1'} rounded-md border border-gray-200`}>
            Page {currentPage + 1}
          </div>
          
          <Button 
            variant="outline" 
            size={isMobile ? "xs" : "icon"} 
            className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full`} 
            onClick={() => onNavigate(Math.min(totalQuestions - 1, currentIndex + 1))}
            disabled={currentIndex === totalQuestions - 1}
          >
            <ChevronRightIcon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
          </Button>
          <Button 
            variant="outline" 
            size={isMobile ? "xs" : "icon"} 
            className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full`} 
            onClick={() => onNavigate(totalQuestions - 1)}
            disabled={currentIndex === totalQuestions - 1}
          >
            <ChevronsRightIcon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
          </Button>
        </div>
        
        {/* Current Page Numbers */}
        <div className={`grid ${isMobile ? 'grid-cols-5 gap-1.5' : 'grid-cols-5 gap-2'}`}>
          {Array.from({ length: endIndex - startIndex + 1 }).map((_, i) => {
            const index = startIndex + i;
            const status = getQuestionStatus(index);
            
            return (
              <QuestionButton 
                key={index}
                index={index}
                status={status}
                onNavigate={onNavigate}
                getQuestionNumber={getQuestionNumber}
                getStatusIcon={getStatusIcon}
                isMobile={isMobile}
              />
            );
          })}
        </div>
      </div>
    );
  };
  
  // Generate full grid for all questions
  const renderFullGrid = () => {
    const columns = isMobile ? 4 : 5; // Reduce columns on mobile
    
    return (
      <div className={`space-y-${isMobile ? '3' : '4'}`}>
        {/* Progress Summary */}
        <div className={`flex justify-between items-center bg-gray-50 ${isMobile ? 'p-2' : 'p-3'} rounded-lg`}>
          <div className="flex items-center gap-2">
            <div className={`flex items-center bg-white ${isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1'} rounded-md shadow-sm border border-gray-200`}>
              <CheckCircleIcon className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1.5'} text-green-500`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{answeredQuestions.size}/{totalQuestions}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center bg-white ${isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1'} rounded-md shadow-sm border border-gray-200`}>
              <FlagIcon className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1.5'} text-amber-500`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{flaggedQuestions.size}</span>
            </div>
          </div>
        </div>

        <ScrollArea className={`${isMobile ? 'h-[180px]' : 'h-[250px]'} pr-2`}>
          <div className={`grid grid-cols-${columns} ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const status = getQuestionStatus(index);
              
              return (
                <QuestionButton 
                  key={index}
                  index={index}
                  status={status}
                  onNavigate={onNavigate}
                  getQuestionNumber={getQuestionNumber}
                  getStatusIcon={getStatusIcon}
                  isMobile={isMobile}
                />
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className={`space-y-${isMobile ? '3' : '4'}`}>
      {/* Tab Navigation */}
      <div className={`bg-gray-50 ${isMobile ? 'p-0.5' : 'p-1'} rounded-lg`}>
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="compact" className={`${isMobile ? 'text-xs h-7' : 'text-sm'} rounded-md`}>
              <ListIcon className={`${isMobile ? 'h-3 w-3 mr-0.5' : 'h-4 w-4 mr-1'}`} />
              {isMobile ? 'Pages' : 'Compact'}
            </TabsTrigger>
            <TabsTrigger value="all" className={`${isMobile ? 'text-xs h-7' : 'text-sm'} rounded-md`}>
              <MapIcon className={`${isMobile ? 'h-3 w-3 mr-0.5' : 'h-4 w-4 mr-1'}`} />
              {isMobile ? 'All' : 'All Questions'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Question Grid */}
      <div className={isMobile ? "mt-1" : "mt-2"}>
        {activeTab === 'compact' ? renderCompactGrid() : renderFullGrid()}
      </div>
      
      {/* Legend */}
      <QuestionStatusLegend isMobile={isMobile} />
      
      {/* Submit Button */}
      {onDirectSubmit ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${isMobile ? 'mt-2 text-xs py-1.5' : 'mt-4 py-2.5'} transition-all duration-200 shadow hover:shadow-md hover:-translate-y-0.5 rounded-lg`}
              variant="default"
            >
              <LifeBuoyIcon className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2"} />
              Review & Finish
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
              <AlertDialogDescription>
                {totalQuestions - answeredQuestions.size > 0 
                  ? `You still have ${totalQuestions - answeredQuestions.size} unanswered questions. Once submitted, you cannot change your answers.`
                  : `Are you sure you want to submit your exam? Once submitted, you cannot change your answers.`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDirectSubmit}>
                Submit Exam
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button 
          onClick={onFinishExam}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${isMobile ? 'mt-2 text-xs py-1.5' : 'mt-4 py-2.5'} transition-all duration-200 shadow hover:shadow-md hover:-translate-y-0.5 rounded-lg`}
          variant="default"
        >
          <LifeBuoyIcon className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2"} />
          Review & Finish
        </Button>
      )}
    </div>
  );
}