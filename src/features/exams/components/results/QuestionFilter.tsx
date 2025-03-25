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
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="all">All Questions</TabsTrigger>
        <TabsTrigger value="correct">Correct</TabsTrigger>
        <TabsTrigger value="incorrect">Incorrect</TabsTrigger>
        <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
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
