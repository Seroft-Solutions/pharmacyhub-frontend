/**
 * Data mapping utilities for exam questions
 * 
 * These utilities help transform data between API and UI formats
 */

import { Question } from '../model/mcqTypes';

/**
 * Transform question data from the API format to the UI format
 * 
 * This handles various format differences between API response and what
 * the UI components expect.
 */
export const transformQuestionData = (question: any): Question => {
  // Create a properly structured question object
  return {
    id: question.id,
    questionNumber: question.questionNumber || question.id,
    text: question.text || question.questionText || '',
    correctAnswer: question.correctAnswer || null,
    explanation: question.explanation || '',
    options: Array.isArray(question.options) 
      ? question.options.map((option: any) => ({
          id: option.id,
          label: option.label || option.optionKey || '',
          text: option.text || option.optionText || '',
          isCorrect: option.isCorrect || false
        }))
      : []
  };
};

/**
 * Transform an array of questions from API format to UI format
 */
export const transformQuestionsArray = (questions: any[]): Question[] => {
  if (!Array.isArray(questions)) {
    console.error('Expected questions array but got:', typeof questions);
    return [];
  }
  
  return questions.map(transformQuestionData);
};