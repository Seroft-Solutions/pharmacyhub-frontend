import React from 'react';
import { ExamScoreResult } from '../../utils/calculateExamScore';
import { Badge } from '@/components/ui/badge';

interface ScoreBreakdownProps {
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  totalMarks: number;
  scoreInfo: ExamScoreResult & {
    displayValue: string;
    displayPercentage: string;
    scoreColor: string;
  };
}

/**
 * Component for displaying the detailed score breakdown with negative marking calculations
 * Clearly shows which questions contribute to the score and which have penalties
 */
export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  correctAnswers,
  incorrectAnswers,
  unanswered,
  totalMarks,
  scoreInfo
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm uppercase text-gray-500">Score Breakdown</h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 px-2">
          {incorrectAnswers > 0 ? 'Negative marking applied' : 'Standard marking'}
        </Badge>
      </div>
      
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Correct Answers ({correctAnswers} × 1.0):</span>
            <span className="font-semibold text-green-600">+{scoreInfo.correctMarks.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Incorrect Answers ({incorrectAnswers} × -0.25):</span>
            <span className="font-semibold text-red-600">{scoreInfo.incorrectPenalty.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Unanswered Questions ({unanswered} × 0):</span>
            <span className="font-semibold">0.0</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="font-semibold">Final Score (out of {totalMarks}):</span>
            <span className="font-semibold">{scoreInfo.score.toFixed(1)}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 italic">
            <p>• Correct answers earn 1 mark each</p>
            <p>• Incorrect selections deduct 0.25 marks each</p>
            <p>• Unanswered questions receive 0 marks (no penalty)</p>
            {scoreInfo.passingMarks && (
              <p>• Passing mark: {scoreInfo.passingMarks}%</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
