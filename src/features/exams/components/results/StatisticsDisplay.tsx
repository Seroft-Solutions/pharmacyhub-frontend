import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { QuestionStatus } from '../../types/QuestionStatus';

interface StatisticsDisplayProps {
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  totalQuestions: number;
  questionStatusMap?: Record<number, QuestionStatus>;
}

/**
 * Enhanced StatisticsDisplay component to clearly separate and validate question counts
 * This ensures we never double-count questions between categories
 */
export const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({
  correctAnswers,
  incorrectAnswers,
  unanswered,
  totalQuestions,
  questionStatusMap
}) => {
  // Validation to ensure the counts add up correctly
  const totalCount = correctAnswers + incorrectAnswers + unanswered;
  const countsValid = totalCount === totalQuestions;
  
  // Log warning if counts are inconsistent
  if (!countsValid) {
    console.warn(
      'Statistics display has inconsistent question counts:', 
      { totalQuestions, totalCount, correctAnswers, incorrectAnswers, unanswered }
    );
  }
  
  return (
    <div>
      <h3 className="text-sm uppercase text-gray-500 mb-3">Question Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-lg p-4 flex items-center">
          <div className="bg-blue-100 p-3 mr-4 rounded-full">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Correct Answers</p>
            <p className="text-lg font-semibold">
              {correctAnswers} ({totalQuestions > 0 ? (correctAnswers / totalQuestions * 100).toFixed(0) : 0}%)
            </p>
            <p className="text-xs text-green-600 mt-1">
              +{correctAnswers * 1} marks
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-4 flex items-center">
          <div className="bg-red-100 p-3 mr-4 rounded-full">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Incorrect Answers</p>
            <p className="text-lg font-semibold">
              {incorrectAnswers} ({totalQuestions > 0 ? (incorrectAnswers / totalQuestions * 100).toFixed(0) : 0}%)
            </p>
            <p className="text-xs text-red-600 mt-1">
              {incorrectAnswers > 0 ? `-${(incorrectAnswers * 0.25).toFixed(1)} mark${incorrectAnswers > 1 ? 's' : ''} penalty` : '0 penalty'}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-4 flex items-center">
          <div className="bg-yellow-100 p-3 mr-4 rounded-full">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Unanswered</p>
            <p className="text-lg font-semibold">
              {unanswered} ({totalQuestions > 0 ? (unanswered / totalQuestions * 100).toFixed(0) : 0}%)
            </p>
            <p className="text-xs text-gray-600 mt-1">
              0 marks (no penalty)
            </p>
          </div>
        </div>
      </div>
      
      {!countsValid && (
        <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 text-sm rounded">
          <strong>Note:</strong> The question counts don't add up to the total number of questions.
          This may indicate an issue with how questions are categorized.
        </div>
      )}
    </div>
  );
};
