import React from 'react';
import { useExamStore } from '@/store/examStore';
import { QuestionAnswer } from '@/types/exam';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, QuestionAnswer>;
}

export const QuestionNavigation = ({
  totalQuestions,
  currentIndex,
  answers
}: QuestionNavigationProps) => {
  const navigateToQuestion = useExamStore((state) => state.navigateToQuestion);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Questions</h2>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const question = useExamStore.getState().questions[i];
          const isAnswered = question && answers[question.id];
          const isActive = i === currentIndex;

          return (
            <button
              key={i}
              onClick={() => navigateToQuestion(i)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${isActive ? 'ring-2 ring-primary' : ''}
                ${isAnswered ? 'bg-green-100 text-green-800' : 'bg-gray-100'}
                hover:bg-gray-200 transition-colors
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 rounded"></div>
          <span className="text-sm">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span className="text-sm">Not answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary rounded"></div>
          <span className="text-sm">Current question</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm text-gray-600">
          Progress: {Object.keys(answers).length} / {totalQuestions}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-primary h-2 rounded-full"
            style={{ width: `${(Object.keys(answers).length / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};