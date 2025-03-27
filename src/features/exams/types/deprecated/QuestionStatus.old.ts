/**
 * Question Status Module
 * 
 * This module provides utilities for determining the status of exam questions
 * using a labels-based approach (A, B, C, D) for consistency across the system.
 */

import { 
  AnswerLabel, 
  areAnswersEqual, 
  findCorrectAnswerLabel, 
  getUserSelectedLabel,
  normalizeToLabel
} from '../utils/AnswerUtils';

import logger from '@/shared/lib/logger';

/**
 * Enum representing all possible states of a question in an exam
 * This ensures that each question is categorized into exactly one state,
 * preventing issues like double-counting in statistics.
 */
export enum QuestionStatus {
  UNANSWERED = 'UNANSWERED',       // User has not selected any option
  ANSWERED_CORRECT = 'CORRECT',    // User selected the correct option
  ANSWERED_INCORRECT = 'INCORRECT', // User selected an incorrect option
  ANSWERED_PENDING = 'PENDING'      // User selected an option but result not yet known (e.g., during the exam)
}

/**
 * Question object type for better type safety
 */
export interface Question {
  id: number;
  questionNumber?: number;
  text?: string;
  options?: any[];
  correctAnswer?: string;
  correctOption?: number | string;
  explanation?: string;
}

/**
 * User answer type for better type safety
 */
export interface UserAnswer {
  questionId: number;
  selectedOption?: number | string;
  answerId?: number | string;
}

/**
 * Determines the status of a question based on user answers and correct answers
 * 
 * @param questionId The ID of the question
 * @param userAnswers Map of user answers by question ID
 * @param correctAnswerMap Map of correct answer labels by question ID
 * @returns The status of the question
 */
export function getQuestionStatus(
  questionId: number, 
  userAnswers: Record<number, UserAnswer>,
  correctAnswerMap: Record<number, AnswerLabel | null>
): QuestionStatus {
  // If no user answer for this question, it's unanswered
  if (!userAnswers[questionId] || (
    userAnswers[questionId].selectedOption === undefined && 
    userAnswers[questionId].answerId === undefined
  )) {
    return QuestionStatus.UNANSWERED;
  }
  
  // If we don't know the correct answer yet, it's pending
  if (correctAnswerMap[questionId] === null || correctAnswerMap[questionId] === undefined) {
    return QuestionStatus.ANSWERED_PENDING;
  }
  
  // Get the user's answer and the correct answer as labels
  const userAnswer = userAnswers[questionId];
  const correctAnswer = correctAnswerMap[questionId];
  
  // Convert to labels for comparison
  const userLabel = getUserSelectedLabel(userAnswer);
  
  // Debug log (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const originalUserSelection = userAnswer.selectedOption !== undefined 
      ? userAnswer.selectedOption.toString() 
      : (userAnswer.answerId ? userAnswer.answerId.toString() : null);
      
    console.log(`Question ${questionId} comparison:`, { 
      originalUserSelection,
      originalCorrectAnswer: correctAnswer,
      normalizedUserLabel: userLabel,
      normalizedCorrectLabel: correctAnswer,
      isMatch: userLabel === correctAnswer,
      userLabelType: typeof userLabel,
      correctLabelType: typeof correctAnswer
    });
  }

  // Compare the labels to determine if the answer is correct
  return (userLabel === correctAnswer && userLabel !== null)
    ? QuestionStatus.ANSWERED_CORRECT
    : QuestionStatus.ANSWERED_INCORRECT;
}

/**
 * Creates a map of question statuses by question ID
 * 
 * @param questions Array of questions
 * @param userAnswers Map of user answers by question ID
 * @returns Map of question statuses by question ID
 */
export function createQuestionStatusMap(
  questions: Question[],
  userAnswers: Record<number, UserAnswer>
): Record<number, QuestionStatus> {
  // Create a map of correct answers by question ID
  const correctAnswerMap: Record<number, AnswerLabel | null> = {};
  
  for (const question of questions) {
    // Find the correct answer label using our utility
    const correctLabel = findCorrectAnswerLabel(question);
    
    // Log the result for debugging
    if (correctLabel) {
      logger.debug(`Question ${question.id}: Determined correct answer is ${correctLabel}`);
    } else {
      logger.warn(`Question ${question.id}: Could not determine correct answer`, question);
    }
    
    correctAnswerMap[question.id] = correctLabel;
  }
  
  // Create the status map
  return Object.fromEntries(
    questions.map(q => [
      q.id, 
      getQuestionStatus(q.id, userAnswers, correctAnswerMap)
    ])
  );
}

/**
 * Check if a user's answer for a question is correct
 * This is a convenience function for direct answer checking
 * 
 * @param question The question object
 * @param userAnswer The user's answer
 * @returns True if the answer is correct, false otherwise
 */
export function isAnswerCorrect(question: Question, userAnswer: UserAnswer): boolean {
  const correctLabel = findCorrectAnswerLabel(question);
  const userLabel = getUserSelectedLabel(userAnswer);
  
  return userLabel !== null && correctLabel !== null && userLabel === correctLabel;
}

/**
 * Get the percentage of correct answers
 * 
 * @param questions Array of questions
 * @param userAnswers Map of user answers
 * @returns Percentage of correct answers (0-100)
 */
export function getScorePercentage(
  questions: Question[],
  userAnswers: Record<number, UserAnswer>
): number {
  if (!questions.length) return 0;
  
  const correctCount = questions.filter(q => 
    isAnswerCorrect(q, userAnswers[q.id])
  ).length;
  
  return Math.round((correctCount / questions.length) * 100);
}
