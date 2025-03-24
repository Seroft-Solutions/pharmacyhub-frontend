import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu, Clock } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ExamTimer } from '../common/ExamTimer';
import { QuestionNavigation } from './QuestionNavigation';
import { useMobileStore, selectIsMobile, MobileOnly, DesktopOnly } from '@/features/core/mobile-support';

interface ExamNavigationBarProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  questions: any[];
  onNavigate: (index: number) => void;
  onFinishExam: () => void;
  durationInMinutes: number;
  onTimeExpired: () => void;
  isCompleted: boolean;
}

export const ExamNavigationBar: React.FC<ExamNavigationBarProps> = ({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  questions,
  onNavigate,
  onFinishExam,
  durationInMinutes,
  onTimeExpired,
  isCompleted
}) => {
  const isMobile = useMobileStore(selectIsMobile);
  
  return (
    <div className={`sticky z-10 ${isMobile ? 'bottom-0 left-0 right-0 border-t bg-white shadow-md px-1.5 py-1' : 'top-0'}`}>
      <div className="flex items-center justify-between">
        {/* Navigation controls */}
        <div className="flex space-x-1.5">
          <Button
            variant="outline"
            size="xs"
            onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-1.5 h-7"
          >
            <ChevronLeft className="h-3 w-3" />
            <span className="hidden sm:inline ml-1">Prev</span>
          </Button>
          
          <Button
            variant="outline"
            size="xs"
            onClick={() => onNavigate(Math.min(totalQuestions - 1, currentIndex + 1))}
            disabled={currentIndex === totalQuestions - 1}
            className="px-1.5 h-7"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Middle section with current progress */}
        <div className="text-center text-xs font-medium">
          <span className="hidden sm:inline">Question </span>
          {currentIndex + 1} / {totalQuestions}
        </div>
        
        {/* Mobile navigation sheet */}
        <MobileOnly>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="xs" className="px-1.5 h-7">
                    <Menu className="h-3 w-3" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] p-3">
                  <div className="h-full overflow-auto py-1">
                    <QuestionNavigation
                      currentIndex={currentIndex}
                      totalQuestions={totalQuestions}
                      answeredQuestions={answeredQuestions}
                      flaggedQuestions={flaggedQuestions}
                      onNavigate={onNavigate}
                      onFinishExam={onFinishExam}
                      questions={questions}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <Button variant="outline" size="xs" className="px-1.5 h-7">
              <Clock className="h-3 w-3" />
            </Button>
          </div>
        </MobileOnly>
        
        {/* Desktop timer */}
        <DesktopOnly>
          <ExamTimer
            durationInMinutes={durationInMinutes}
            onTimeExpired={onTimeExpired}
            isCompleted={isCompleted}
          />
        </DesktopOnly>
      </div>
    </div>
  );
};