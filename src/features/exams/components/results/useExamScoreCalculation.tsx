import { useMemo } from 'react';
import { ExamResult, Question } from '../../model/standardTypes';
import { calculateExamScore, formatScore } from '../../utils/calculateExamScore';
import { calculateExamStatistics } from '../../utils/examStatisticsCalculator';

/**
 * Custom hook to calculate and format exam scores consistently with negative marking
 * 
 * @param result The exam result object
 * @param questions Optional array of questions for more accurate calculation
 * @param userAnswers Optional map of user answers for more accurate calculation
 * @returns Calculated and formatted score information
 */
export function useExamScoreCalculation(result: ExamResult, questions?: Question[], userAnswers?: Record<number, any>) {
  return useMemo(() => {
    // Use calculated statistics if questions and userAnswers are provided
    let correctAnswers, incorrectAnswers, unanswered, totalQuestions;
    
    if (questions && userAnswers) {
      // Calculate accurate statistics using our utility
      const stats = calculateExamStatistics(questions, userAnswers);
      correctAnswers = stats.correctAnswers;
      incorrectAnswers = stats.incorrectAnswers;
      unanswered = stats.unanswered;
      totalQuestions = stats.totalQuestions;
    } else {
      // Fall back to result data if we can't calculate
      correctAnswers = result.correctAnswers;
      incorrectAnswers = result.incorrectAnswers;
      unanswered = result.unanswered;
      totalQuestions = result.totalQuestions;
      
      // Validate that the counts add up to total questions
      const totalAnswers = correctAnswers + incorrectAnswers + unanswered;
      
      if (totalAnswers !== totalQuestions) {
        console.warn(
          'Inconsistent question counts in ExamResult:', 
          { 
            totalQuestions, 
            totalAnswers,
            correctAnswers, 
            incorrectAnswers, 
            unanswered 
          }
        );
      }
    }
    
    const passingMarks = result.passingMarks || 40;
    
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
      if (percentage >= passingMarks) return "text-blue-500";
      return "text-red-500";
    };
    
    return {
      ...scoreResult,
      ...formattedScore,
      scoreColor: getScoreColor(scoreResult.percentage),
      isPassing: scoreResult.isPassing, // Use calculated isPassing instead of result.isPassed
    };
  }, [result, questions, userAnswers]);
}
