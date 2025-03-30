/**
 * Type utility functions for exam preparation
 * 
 * Contains helper functions for manipulating and converting between different
 * type representations in the exams preparation feature.
 */

import { QuestionStatus } from '../api/enums';

/**
 * Convert an index to a label (0 -> A, 1 -> B, 2 -> C, 3 -> D)
 * 
 * @param index Zero-based index of the option
 * @returns The corresponding label or null if invalid
 */
export function indexToLabel(index: number): string | null {
  if (index === null || index === undefined || isNaN(index) || index < 0 || index > 25) {
    return null;
  }
  return String.fromCharCode(65 + index); // 0->A, 1->B, 2->C, 3->D, etc.
}

/**
 * Convert a label to an index (A -> 0, B -> 1, C -> 2, D -> 3)
 * 
 * @param label The label to convert
 * @returns The corresponding zero-based index or null if invalid
 */
export function labelToIndex(label: string): number | null {
  if (!label || typeof label !== 'string' || label.length !== 1) {
    return null;
  }
  
  const upperLabel = label.toUpperCase();
  if (upperLabel < 'A' || upperLabel > 'Z') {
    return null;
  }
  
  return upperLabel.charCodeAt(0) - 65; // A->0, B->1, C->2, D->3, etc.
}

/**
 * Type for answer labels (A, B, C, D)
 */
export type AnswerLabel = 'A' | 'B' | 'C' | 'D';

/**
 * Normalize a value to an answer label regardless of input format
 * 
 * @param value The value to normalize (could be index, label, etc.)
 * @returns The standardized answer label or null if conversion isn't possible
 */
export function normalizeToLabel(value: string | number | null | undefined): AnswerLabel | null {
  if (value === null || value === undefined) return null;
  
  const strValue = String(value).trim();
  
  // Case 1: Already a valid label
  if (/^[A-Da-d]$/.test(strValue)) {
    return strValue.toUpperCase() as AnswerLabel;
  }
  
  // Case 2: Numeric index (0-3)
  const numValue = Number(strValue);
  if (!isNaN(numValue) && numValue >= 0 && numValue <= 3) {
    return indexToLabel(numValue) as AnswerLabel;
  }
  
  // Couldn't normalize the value
  return null;
}

/**
 * Check if two answer representations match, regardless of format
 * 
 * @param value1 First value to compare (could be index, label, etc.)
 * @param value2 Second value to compare (could be index, label, etc.)
 * @returns True if they represent the same answer, false otherwise
 */
export function areAnswersEqual(
  value1: string | number | null | undefined,
  value2: string | number | null | undefined
): boolean {
  const label1 = normalizeToLabel(value1);
  const label2 = normalizeToLabel(value2);
  
  // Both must be valid and equal
  return label1 !== null && label2 !== null && label1 === label2;
}

/**
 * Extracts the label from a user answer, handling various formats
 * 
 * @param userAnswer The user's answer object
 * @returns The answer as a label (A, B, C, D), or null if not available
 */
export function getUserAnswerLabel(userAnswer: any): string | null {
  if (!userAnswer) {
    return null;
  }
  
  // If the answer already has a label property, use it
  if (userAnswer.label) {
    return userAnswer.label.toUpperCase();
  }
  
  // If we have selectedOption as an index, convert to label
  if (userAnswer.selectedOption !== undefined) {
    const index = typeof userAnswer.selectedOption === 'string' 
      ? parseInt(userAnswer.selectedOption, 10)
      : userAnswer.selectedOption;
      
    if (!isNaN(index)) {
      return indexToLabel(index);
    }
  }
  
  return null;
}

/**
 * Extracts the correct answer label from a question, handling various formats
 * 
 * @param question The question object
 * @returns The correct answer as a label (A, B, C, D), or null if not available
 */
export function getCorrectAnswerLabel(question: any): string | null {
  if (!question) {
    return null;
  }
  
  // If question directly specifies correctAnswer as a label
  if (question.correctAnswer && typeof question.correctAnswer === 'string') {
    // If it's already a single letter, use it as is
    if (question.correctAnswer.length === 1 && /[A-Da-d]/.test(question.correctAnswer)) {
      return question.correctAnswer.toUpperCase();
    }
  }
  
  // If question has a correctOption that's an index, convert to label
  if (question.correctOption !== undefined) {
    const index = typeof question.correctOption === 'string' 
      ? parseInt(question.correctOption, 10)
      : question.correctOption;
      
    if (!isNaN(index)) {
      return indexToLabel(index);
    }
  }
  
  // Try to find the correct option in the options array
  if (question.options && Array.isArray(question.options)) {
    // Check for any option with isCorrect=true
    const correctOption = question.options.find(opt => opt.isCorrect === true);
    if (correctOption) {
      // If the option has a label, use it
      if (correctOption.label) {
        return correctOption.label.toUpperCase();
      }
      
      // Otherwise, determine its index in the array and convert to label
      const index = question.options.indexOf(correctOption);
      if (index >= 0) {
        return indexToLabel(index);
      }
    }
  }
  
  return null;
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
  userAnswers: Record<number, any>,
  correctAnswerMap: Record<number, string | null>
): QuestionStatus {
  // If no user answer for this question, it's unanswered
  if (!userAnswers[questionId] || 
      (userAnswers[questionId].selectedOption === undefined && userAnswers[questionId].answerId === undefined)) {
    return QuestionStatus.UNANSWERED;
  }
  
  // If we don't know the correct answer yet, it's pending
  if (correctAnswerMap[questionId] === null || correctAnswerMap[questionId] === undefined) {
    return QuestionStatus.ANSWERED_PENDING;
  }
  
  // Get the user's answer and convert to a label
  const userAnswer = userAnswers[questionId];
  const userLabel = getUserAnswerLabel(userAnswer);
  
  // Get the correct answer label
  const correctLabel = correctAnswerMap[questionId];
  
  // Compare labels directly - both must be non-null and equal
  return (userLabel && correctLabel && userLabel === correctLabel)
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
  questions: any[],
  userAnswers: Record<number, any>
): Record<number, QuestionStatus> {
  // Create a map of correct answer labels by question ID
  const correctAnswerMap: Record<number, string | null> = {};
  
  for (const question of questions) {
    // Use our utility function to get the correct answer label
    const correctLabel = getCorrectAnswerLabel(question);
    
    // Store the correct answer label in our map
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
