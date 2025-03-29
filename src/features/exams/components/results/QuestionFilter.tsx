import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuestionStatus } from "../../types/QuestionStatus";
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Question } from '../../model/standardTypes';

interface QuestionFilterProps {
  questions: Question[];
  questionStatusMap: Record<number, QuestionStatus>;
  onSelectQuestion: (questionId: number) => void;
}

/**
 * Component for filtering and displaying questions by their status (correct, incorrect, unanswered)
 */
export const QuestionFilter: React.FC<QuestionFilterProps> = ({
  questions,
  questionStatusMap,
  onSelectQuestion
}) => {
  // Count questions by status
  const correctCount = questions.filter(q => 
    questionStatusMap[q.id] === QuestionStatus.ANSWERED_CORRECT
  ).length;
  
  const incorrectCount = questions.filter(q => 
    questionStatusMap[q.id] === QuestionStatus.ANSWERED_INCORRECT
  ).length;
  
  const unansweredCount = questions.filter(q => 
    questionStatusMap[q.id] === QuestionStatus.UNANSWERED
  ).length;
  
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-4 h-10 mb-4 p-1 px-0.5 bg-slate-100 rounded-lg">
        <TabsTrigger 
          value="all" 
          className="text-[10px] sm:text-xs rounded-md font-medium px-1 sm:px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700"
        >
          All
        </TabsTrigger>
        
        <TabsTrigger 
          value="correct"
          className="text-[10px] sm:text-xs rounded-md font-medium px-1 sm:px-2 data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
        >
          <span>Correct</span>
          {correctCount > 0 && (
            <span className="ml-0.5 sm:ml-1 rounded-full bg-green-100 px-1 py-0.5 text-[8px] sm:text-xs text-green-700">
              {correctCount}
            </span>
          )}
        </TabsTrigger>
        
        <TabsTrigger 
          value="incorrect"
          className="text-[10px] sm:text-xs rounded-md font-medium px-1 sm:px-2 data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm"
        >
          <span>Wrong</span>
          {incorrectCount > 0 && (
            <span className="ml-0.5 sm:ml-1 rounded-full bg-red-100 px-1 py-0.5 text-[8px] sm:text-xs text-red-700">
              {incorrectCount}
            </span>
          )}
        </TabsTrigger>
        
        <TabsTrigger 
          value="unanswered"
          className="text-[10px] sm:text-xs rounded-md font-medium px-1 sm:px-2 data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm"
        >
          <span>Skip</span>
          {unansweredCount > 0 && (
            <span className="ml-0.5 sm:ml-1 rounded-full bg-amber-100 px-1 py-0.5 text-[8px] sm:text-xs text-amber-700">
              {unansweredCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <QuestionList 
          questions={questions}
          statusMap={questionStatusMap}
          onSelectQuestion={onSelectQuestion}
        />
      </TabsContent>
      
      <TabsContent value="correct">
        <QuestionList 
          questions={questions.filter(q => 
            questionStatusMap[q.id] === QuestionStatus.ANSWERED_CORRECT
          )}
          statusMap={questionStatusMap}
          onSelectQuestion={onSelectQuestion}
        />
      </TabsContent>
      
      <TabsContent value="incorrect">
        <QuestionList 
          questions={questions.filter(q => 
            questionStatusMap[q.id] === QuestionStatus.ANSWERED_INCORRECT
          )}
          statusMap={questionStatusMap}
          onSelectQuestion={onSelectQuestion}
        />
      </TabsContent>
      
      <TabsContent value="unanswered">
        <QuestionList 
          questions={questions.filter(q => 
            questionStatusMap[q.id] === QuestionStatus.UNANSWERED
          )}
          statusMap={questionStatusMap}
          onSelectQuestion={onSelectQuestion}
        />
      </TabsContent>
    </Tabs>
  );
};

// Helper component to display questions
interface QuestionListProps {
  questions: Question[];
  statusMap: Record<number, QuestionStatus>;
  onSelectQuestion: (questionId: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  statusMap,
  onSelectQuestion
}) => {
  if (questions.length === 0) {
    return <p className="text-center py-4 text-gray-500">No questions in this category</p>;
  }
  
  return (
    <div className="space-y-2">
      {questions.map(question => (
        <div 
          key={question.id}
          className={`p-3 rounded-lg cursor-pointer flex items-center ${
            statusMap[question.id] === QuestionStatus.ANSWERED_CORRECT
              ? 'bg-green-50 border border-green-200'
              : statusMap[question.id] === QuestionStatus.ANSWERED_INCORRECT
                ? 'bg-red-50 border border-red-200'
                : 'bg-yellow-50 border border-yellow-200'
          }`}
          onClick={() => onSelectQuestion(question.id)}
        >
          <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mr-3 bg-white">
            {question.questionNumber}
          </div>
          <div className="flex-1 truncate">{question.text}</div>
          <div className="ml-2">
            {statusMap[question.id] === QuestionStatus.ANSWERED_CORRECT ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : statusMap[question.id] === QuestionStatus.ANSWERED_INCORRECT ? (
              <XCircle className="h-5 w-5 text-red-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};