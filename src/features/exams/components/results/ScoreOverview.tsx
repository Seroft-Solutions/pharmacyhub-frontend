import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ScoreOverviewProps {
  scoreInfo: {
    displayPercentage: string;
    displayValue: string;
    percentage: number;
    scoreColor: string;
    incorrectPenalty: number;
  };
  isPassed: boolean;
  passingMarks: number;
  totalMarks: number;
}

/**
 * Component for displaying the main score overview with progress bar
 */
export const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  scoreInfo,
  isPassed,
  passingMarks,
  totalMarks
}) => {
  const passingPercentage = (passingMarks / totalMarks) * 100;
  
  return (
    <div className="text-center">
      <h3 className="text-sm uppercase text-gray-500 mb-2">Your Score</h3>
      <div className={`text-4xl font-bold ${scoreInfo.scoreColor}`}>
        {scoreInfo.displayValue}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        out of {totalMarks} marks
      </div>
      {scoreInfo.incorrectPenalty !== 0 && (
        <div className="text-xs text-gray-500 mt-1 italic">
          (Includes -{Math.abs(scoreInfo.incorrectPenalty).toFixed(1)} mark penalty for incorrect answers)
        </div>
      )}
      
      <div className="mt-6">
        <Progress
          value={scoreInfo.percentage}
          className="h-3"
          indicatorClassName={isPassed ? "bg-green-500" : "bg-red-500"}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>{passingPercentage.toFixed(0)}% (Pass Mark)</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
