import { useMemo } from 'react';
import { ExamResult } from '../../model/standardTypes';
import { calculateExamScore, formatScore } from '../../utils/calculateExamScore';

/**
 * Custom hook to calculate and format exam scores consistently
 * 
 * @param result The exam result object
 * @returns Calculated and formatted score information
 */
export function useExamScoreCalculation(result: ExamResult) {
  return useMemo(() => {
    const { correctAnswers, incorrectAnswers, unanswered, totalQuestions, passingMarks = 40 } = result;
    
    // Calculate the score using the standardized calculation function
    const scoreResult = calculateExamScore(
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      passingMarks
    );
    
    // Format the score for display
    const formattedScore = formatScore(
      scoreResult.score,
      scoreResult.totalMarks
    );
    
    // Determine color based on the percentage
    const getScoreColor = (percentage: number) => {
      if (percentage >= 80) return "text-green-500";
      if (percentage >= 60) return "text-yellow-500";
      return "text-red-500";
    };
    
    return {
      ...scoreResult,
      ...formattedScore,
      scoreColor: getScoreColor(scoreResult.percentage),
      isPassing: scoreResult.isPassing, // Use calculated isPassing instead of result.isPassed
    };
  }, [result]);
}