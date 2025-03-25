/**
 * Utility to accurately calculate exam statistics by properly distinguishing 
 * between attempted and unattempted questions
 */

import { Question } from '../model/standardTypes';
import { QuestionStatus, createQuestionStatusMap } from '../types/QuestionStatus';
import { calculateExamScore as calculateScore } from './calculateExamScore';

/**
 * Calculate exam statistics ensuring each question is counted in exactly one category
 * 
 * @param questions Array of questions in the exam
 * @param userAnswers Map of user answers by question ID
 * @returns Statistics object with counts and score
 */
export function calculateExamStatistics(questions, userAnswers) {
  // First collect all question IDs to track which ones have been answered
  const allQuestionIds = questions.map(q => q.id);
  const totalQuestions = allQuestionIds.length;
  
  // Generate question status map for each question
  const questionStatusMap = createQuestionStatusMap(questions, userAnswers);
  
  // Count questions by status
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  
  // For each question, add to exactly one category based on its status
  for (const questionId of allQuestionIds) {
    const status = questionStatusMap[questionId];
    
    switch (status) {
      case QuestionStatus.ANSWERED_CORRECT:
        correctCount++;
        break;
      case QuestionStatus.ANSWERED_INCORRECT:
        incorrectCount++;
        break;
      case QuestionStatus.UNANSWERED:
        unansweredCount++;
        break;
      // ANSWERED_PENDING is not relevant for final statistics
    }
  }
  
  // Validate the counts add up to totalQuestions
  if (correctCount + incorrectCount + unansweredCount !== totalQuestions) {
    console.error('Question count mismatch', {
      total: totalQuestions,
      sumOfParts: correctCount + incorrectCount + unansweredCount,
      correct: correctCount,
      incorrect: incorrectCount,
      unanswered: unansweredCount
    });
  }
  
  // Calculate score using the standardized calculateExamScore utility
  const score = calculateScore(
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount
  );
  
  return {
    totalQuestions,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    unanswered: unansweredCount,
    score,
    questionStatusMap
  };
}

// Note: Local calculateExamScore function has been removed in favor of using
// the standardized implementation from calculateExamScore.ts
// This ensures consistency across the codebase and prevents potential bugs
